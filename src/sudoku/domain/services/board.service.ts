import type { Pos } from '~/share/domain/entities'
import { inject, InvalidBoardError } from '~/share/utils'

import { Cell, Grid, type SolutionJSON, type ValidNumbers } from '../entities'
import { type Board, type BoardJSON, type IBoard, type SudokuSetts } from '../models'
import { BoardObs, ErrorsObs, MovesObs } from './sudoku-obs.service'

/** Represent a Sudoku Board Service. */
export class BoardSvc implements IBoard {
	#correctCells = 0
	readonly #errorsObs = inject(ErrorsObs)
	readonly #movesObs = inject(MovesObs)
	readonly #obs = inject(BoardObs)

	/**
	 * Creates an instance of the BoardSvc class.
	 * @param grid Initial Sudoku board.
	 * @param errors The initials errors.
	 */
	constructor(grid: Grid<Cell.Cell>, errors: number) {
		this.#obs.set(grid)
		this.#correctCells = this.#obs.data!.count(({ isCorrect }) => isCorrect)
		this.#errorsObs.set(errors)
	}

	get data(): Board {
		return this.#obs.data!.data
	}

	get errors() {
		return this.#errorsObs.data
	}

	get hasWin() {
		return this.#correctCells === 81
	}

	/**
	 * Create an instance of BoardSvc with options.
	 * @param settings Settings for create board.
	 * @param errors The previous game errors, if is new game is 0.
	 */
	static create(settings: SudokuSetts, errors: number): BoardSvc
	static create({ difficulty, solution }: SudokuSetts, errors: number) {
		const diffNum = Number(difficulty)
		const grid = Grid.create<Cell.Cell>(pos => {
			const isInitial = Boolean(Math.floor(Math.random() * diffNum))
			return Cell.create({ isInitial, solution: solution.grid.cellBy(pos) })
		})

		return new BoardSvc(grid, errors)
	}

	/**
	 * Create an instance of BoardSvc from a JSON string
	 * @param boardLike JSON representation of board.
	 * @param solution JSON representation of solutions.
	 * @param errors The previous game errors, if is new game is 0.
	 * @throws {InvalidBoardError} If `boardLike` is not a valid JSON.
	 * @returns A new Board Service.
	 */
	static fromJSON(boardLike: BoardJSON, solution: SolutionJSON, errors: number) {
		try {
			if (Array.isArray(boardLike)) {
				const data = new Grid(boardLike).mapAll<Cell.Cell>((json, { col, row }) =>
					Cell.fromJSON({ cellLike: json, solution: solution[row][col] })
				)
				return new BoardSvc(data, errors)
			} else throw new InvalidBoardError(boardLike)
		} catch (err) {
			throw err instanceof InvalidBoardError ? err : new InvalidBoardError(boardLike, err)
		}
	}

	/**
	 * Create an instance of BoardSvc from a JSON string
	 * @param boardLike JSON representation of board.
	 * @param solution JSON representation of solutions.
	 * @param errors The previous game errors, if is new game is 0.
	 * @throws {InvalidBoardError} If `boardLike` is not a valid JSON string.
	 * @returns A new Board Service.
	 */
	static fromString(boardLike: string, solution: SolutionJSON, errors: number) {
		try {
			const cellJSONs: BoardJSON = JSON.parse(boardLike)

			return this.fromJSON(cellJSONs, solution, errors)
		} catch (err) {
			throw err instanceof InvalidBoardError ? err : new InvalidBoardError(boardLike, err)
		}
	}

	clear(cellPos: Pos.Pos) {
		const moveMap: Cell.MoveMap = new Map()

		this.#obs.update(grid =>
			grid!
				.mapBy(cellPos)
				.cell(cell => cell.clear())
				.apply(({ prev, next }, pos) => {
					if (prev.isCorrect && !next.isCorrect) this.#correctCells--
					if (next.id !== prev.id) moveMap.set(...this.#createMoveMapEntries({ next, prev }, pos))
				})
		)

		if (moveMap.size > 0) this.#movesObs.overwrite(moveMap)
		return this
	}

	noteDeletion(cellPos: Pos.Pos, num: ValidNumbers) {
		const moveMap: Cell.MoveMap = new Map()

		this.#obs.update(board =>
			board!
				.mapBy(cellPos)
				.related.withoutOrigin.onlyIf(this.#notIsInitial(cellPos), cell => cell.removeNote(num))
				.apply(({ prev, next }, pos) => {
					if (next.id !== prev.id) moveMap.set(...this.#createMoveMapEntries({ next, prev }, pos))
				})
		)
		if (moveMap.size > 0) this.#movesObs.overwrite(moveMap)
		return this
	}

	redo() {
		const move = this.#movesObs.data

		this.#obs.update(board =>
			board!.mapAll((cell, pos) => {
				const key = pos.toString()
				if (!move.has(key)) return cell

				return cell.changeByMove(move.get(key)!.next)
			})
		)
		this.#movesObs.redo()

		return this
	}

	toJSON(): BoardJSON {
		return this.#obs.data!.mapAll(cell => cell.toJSON()).data
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	toggleNotes(cellPos: Pos.Pos, num: ValidNumbers) {
		const moveMap: Cell.MoveMap = new Map()

		this.#obs.update(board =>
			board!
				.mapBy(cellPos)
				.cell(cell => cell.toggleNote(num))
				.apply(({ next, prev }, pos) => {
					if (prev.isCorrect && !next.isCorrect) this.#correctCells--
					if (next.id !== prev.id) moveMap.set(...this.#createMoveMapEntries({ next, prev }, pos))
				})
		)
		if (moveMap.size > 0) this.#movesObs.overwrite(moveMap)
		return this
	}

	undo() {
		const move = this.#movesObs.data

		this.#obs.update(board =>
			board!.mapAll((cell, pos) => {
				const key = pos.toString()
				if (!move.has(key)) return cell

				return cell.changeByMove(move.get(key)!.prev)
			})
		)

		this.#movesObs.undo()

		return this
	}

	validate(cellPos: Pos.Pos) {
		this.#obs.update(board =>
			board!
				.mapBy(cellPos)
				.cell(cell => cell.verify(this.#verify))
				.apply()
		)
		return this
	}

	validateAllBoard() {
		this.#obs.update(board => board!.mapAll(cell => cell.verify(this.#verify)))
		return this
	}

	write(cellPos: Pos.Pos, num: ValidNumbers) {
		const moveMap: Cell.MoveMap = new Map()

		this.#obs.update(board =>
			board!
				.mapBy(cellPos)
				.cell(cell => cell.writeValue(num))
				.apply(({ next, prev }, pos) => {
					if (!prev.isCorrect && next.isCorrect) this.#correctCells++
					if (prev.isCorrect && !next.isCorrect) this.#correctCells--
					moveMap.set(...this.#createMoveMapEntries({ prev, next }, pos))
				})
		)

		if (moveMap.size > 0) this.#movesObs.overwrite(moveMap)
		return this
	}

	#createMoveMapEntries({ next, prev }: { next: Cell.Cell; prev: Cell.Cell }, pos: Pos.Pos) {
		return [
			pos.toString(),
			{ next: { notes: next.notes, pos, value: next.value }, prev: { notes: prev.notes, pos, value: prev.value } },
		] as const
	}

	#notIsInitial(pos: Pos.Pos) {
		return this.#obs.data!.cellBy(pos).kind !== Cell.Kind.Initial
	}

	readonly #verify = (isIncorrect: boolean) => {
		if (isIncorrect) this.#errorsObs.update(err => ++err)
	}
}
