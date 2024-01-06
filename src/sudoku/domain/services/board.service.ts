import type { Pos } from '~/share/domain/models'
import { PosSvc } from '~/share/domain/services'
import { inject, InvalidBoardError } from '~/share/utils'

import { type GameOpts, type IGrid, type SolutionJSON, type ValidNumbers } from '../models'
import { type Board, type BoardJSON, type IBoard } from '../models/board.model'
import { CellKind, type ICell, type MoveMap } from '../models/cell.model'
import { CellSvc } from './cell.service'
import { GridSvc } from './grid.service'
import { BoardObs, ErrorsObs, MovesObs } from './sudoku-obs.service'

/** Represent a Sudoku Board Service. */
export class BoardSvc implements IBoard {
	#correctCells = 0
	#errors
	readonly #errorsObs = inject(ErrorsObs)
	#grid
	readonly #movesObs = inject(MovesObs)
	readonly #obs = inject(BoardObs)

	/**
	 * Creates an instance of the BoardSvc class.
	 * @param grid Initial Sudoku board.
	 */
	constructor(grid: IGrid<ICell>, errors: number) {
		this.#grid = grid
		this.#obs.set(this.data)
		this.#correctCells = this.#grid.count(({ isCorrect }) => isCorrect)
		this.#errors = errors
	}

	get data(): Board {
		return this.#grid.mapAll(cell => cell.data).data
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
		const grid = GridSvc.create<ICell>(pos => {
			const isInitial = Boolean(Math.floor(Math.random() * diffNum))
			return CellSvc.create({ isInitial, solution: solution.grid.cellBy(pos), pos })
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
				const data = new GridSvc(boardLike).mapAll<ICell>((json, { y, x }) =>
					CellSvc.fromJSON({ cellLike: json, solution: solution[y][x], pos: { y, x } })
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

		this.#grid = this.#grid
			.mapBy(cellPos)
			.cell(cell => cell.clear())
			.apply((cell, pos) => {
				moveMap.set(...this.#createMoveMapEntries(cell, pos))
			})

		this.#obs.set(this.data)
		if (moveMap.size > 0) this.#movesObs.overwrite(moveMap)
		return this
	}

	noteDeletion(cellPos: Pos, num: ValidNumbers) {
		const moveMap: MoveMap = new Map()

		this.#grid = this.#grid
			.mapBy(cellPos)
			.related.withoutOrigin.onlyIf(this.#notIsInitial(cellPos), cell => cell.removeNote(num))
			.apply((cell, pos) => {
				moveMap.set(...this.#createMoveMapEntries(cell, pos))
			})
		this.#obs.set(this.data)
		if (moveMap.size > 0) this.#movesObs.overwrite(moveMap)
		return this
	}

	redo() {
		const move = this.#movesObs.redo().data

		this.#grid = this.#grid.mapAll((cell, pos) => {
			const key = PosSvc.parseString(pos)
			if (!move.has(key)) return cell

			return cell.changeByMove(move.get(key)!)
		})

		this.#obs.set(this.data)

		return this
	}

	toJSON(): BoardJSON {
		return this.#grid.mapAll(cell => cell.toJSON()).data
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	toggleNotes(cellPos: Pos, num: ValidNumbers) {
		const moveMap: MoveMap = new Map()

		this.#grid = this.#grid
			.mapBy(cellPos)
			.cell(cell => cell.toggleNote(num))
			.apply((cell, pos) => {
				moveMap.set(...this.#createMoveMapEntries(cell, pos))
			})
		this.#obs.set(this.data)
		if (moveMap.size > 0) this.#movesObs.overwrite(moveMap)
		return this
	}

	undo() {
		const move = this.#movesObs.undo().data

		this.#grid = this.#grid.mapAll((cell, pos) => {
			const key = PosSvc.parseString(pos)
			if (!move.has(key)) return cell

			return cell.changeByMove(move.get(key)!)
		})

		this.#obs.set(this.data)

		return this
	}

	validate(cellPos: Pos) {
		this.#grid = this.#grid
			.mapBy(cellPos)
			.cell(cell => cell.verify(this.#verify))
			.apply()
		this.#errorsObs.set(this.#errors)
		this.#obs.set(this.data)
		return this
	}

	validateAllBoard() {
		this.#grid = this.#grid.mapAll(cell => cell.verify(this.#verify))
		this.#errorsObs.set(this.#errors)
		this.#obs.set(this.data)
		return this
	}

	write(cellPos: Pos, num: ValidNumbers) {
		const moveMap: MoveMap = new Map()

		this.#grid = this.#grid
			.mapBy(cellPos)
			.cell(cell => cell.writeValue(num))
			.apply((cell, pos) => {
				if (cell.isCorrect) this.#correctCells++
				moveMap.set(...this.#createMoveMapEntries(cell, pos))
			})

		this.#obs.set(this.data)
		if (moveMap.size > 0) this.#movesObs.overwrite(moveMap)
		return this
	}

	#createMoveMapEntries({ notes, value }: ICell, pos: Pos) {
		return [`${pos.y}-${pos.x}`, { notes, pos, value }] as const
	}

	#notIsInitial(pos: Pos) {
		return this.#grid.cellBy(pos).kind !== CellKind.Initial
	}

	readonly #verify = (isIncorrect: boolean) => {
		if (isIncorrect) this.#errors++
	}
}
