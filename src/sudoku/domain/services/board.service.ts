import { type Pos } from '~/share/domain/entities'
import { inject, InvalidBoardError } from '~/share/utils'

import { Cell, CellKind, Grid, type MoveMap, type SolutionJSON, type ValidNumbers } from '../entities'
import { type Board, type BoardJSON, type GameOpts, type IBoard } from '../models'
import { BoardObs, ErrorsObs, MovesObs } from './sudoku-obs.service'

/** Represent a Sudoku Board Service. */
export class BoardSvc implements IBoard {
	#correctCells = 0
	#errors
	readonly #errorsObs = inject(ErrorsObs)
	readonly #movesObs = inject(MovesObs)
	readonly #obs = inject(BoardObs)

	/**
	 * Creates an instance of the BoardSvc class.
	 * @param grid Initial Sudoku board.
	 */
	constructor(grid: Grid<Cell>, errors: number) {
		this.#obs.set(grid)
		this.#correctCells = this.#obs.data!.count(({ isCorrect }) => isCorrect)
		this.#errors = errors
	}

	get data(): Board {
		return this.#obs.data!.data
	}

	get hasWin() {
		return this.#correctCells === 81
	}

	/**
	 * Create an instance of BoardSvc with options.
	 * @param opts Options for create board (optional).
	 */
	static create(opts: GameOpts, errors: number): BoardSvc
	static create({ difficulty, solution }: GameOpts, errors: number) {
		const diffNum = Number(difficulty)
		const grid = Grid.create<Cell>(pos => {
			const isInitial = Boolean(Math.floor(Math.random() * diffNum))
			return Cell.create({ isInitial, solution: solution.grid.cellBy(pos) })
		})

		return new BoardSvc(grid, errors)
	}

	/**
	 * Create an instance of BoardSvc from a JSON string
	 * @param boardLike JSON representation of board.
	 * @param solution JSON representation of solutions.
	 * @throws {InvalidBoardError} If `boardLike` is not a valid JSON.
	 */
	static fromJSON(boardLike: BoardJSON, solution: SolutionJSON, errors: number) {
		try {
			if (Array.isArray(boardLike)) {
				const data = new Grid(boardLike).mapAll<Cell>((json, { y, x }) =>
					Cell.fromJSON({ cellLike: json, solution: solution[y][x] })
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
	 * @throws {InvalidBoardError} If `boardLike` is not a valid JSON string.
	 */
	static fromString(boardLike: string, solution: SolutionJSON, errors: number) {
		try {
			const cellJSONs: BoardJSON = JSON.parse(boardLike)

			return this.fromJSON(cellJSONs, solution, errors)
		} catch (err) {
			throw err instanceof InvalidBoardError ? err : new InvalidBoardError(boardLike, err)
		}
	}

	clear(cellPos: Pos) {
		const moveMap: MoveMap = new Map()

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

	noteDeletion(cellPos: Pos, num: ValidNumbers) {
		const moveMap: MoveMap = new Map()

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

	toggleNotes(cellPos: Pos, num: ValidNumbers) {
		const moveMap: MoveMap = new Map()

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

	validate(cellPos: Pos) {
		this.#obs.update(board =>
			board!
				.mapBy(cellPos)
				.cell(cell => cell.verify(this.#verify))
				.apply()
		)
		this.#errorsObs.set(this.#errors)
		return this
	}

	validateAllBoard() {
		this.#obs.update(board => board!.mapAll(cell => cell.verify(this.#verify)))
		this.#errorsObs.set(this.#errors)
		return this
	}

	write(cellPos: Pos, num: ValidNumbers) {
		const moveMap: MoveMap = new Map()

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

	#createMoveMapEntries({ next, prev }: { next: Cell; prev: Cell }, pos: Pos) {
		return [
			`${pos.y}-${pos.x}`,
			{ next: { notes: next.notes, pos, value: next.value }, prev: { notes: prev.notes, pos, value: prev.value } },
		] as const
	}

	#notIsInitial(pos: Pos) {
		return this.#obs.data!.cellBy(pos).kind !== CellKind.Initial
	}

	readonly #verify = (isIncorrect: boolean) => {
		if (isIncorrect) this.#errors++
	}
}
