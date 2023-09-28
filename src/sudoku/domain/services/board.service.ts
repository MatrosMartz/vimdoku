import type { Position } from '~/share/domain/models'
import { InvalidBoardError } from '~/share/utils'

import {
	type BoardData,
	type BoardOpts,
	type CellJSON,
	CellKinds,
	DifficultyKinds,
	type IBoard,
	type ICell,
	type IGrid,
	type IWritableCell,
	type ValidNumbers,
} from '../models'
import { InitialCellService, WritableCellService } from './cell.service'
import { GridService } from './grid.service'
import { NotesService } from './notes.service'
import { SolutionService } from './solution.service'

/** Represent a Sudoku Board. */
export class BoardService implements IBoard {
	#grid

	/**
	 * Creates an instance of the Board class.
	 * @param {BoardService} grid Initial Sudoku board.
	 */
	constructor(grid: IGrid<ICell>) {
		this.#grid = grid
	}

	get data(): BoardData {
		return this.#grid.data
	}

	/**
	 * Create new instance of Board class with options.
	 * @param {BoardOpts} [opts] Options for create board (optional).
	 */
	static create(opts?: Partial<BoardOpts>): BoardService
	static create({
		difficulty = DifficultyKinds.Beginner,
		solution = SolutionService.create(),
	}: Partial<BoardOpts> = {}) {
		let initials = 0
		const grid = GridService.create<ICell>(pos => {
			const isInitial = Boolean(Math.random() * 2) && initials < difficulty
			if (!isInitial) return new WritableCellService()

			initials++
			return new InitialCellService(solution.grid.getCell(pos))
		})

		return new BoardService(grid)
	}

	/**
	 * Create instance of Board class from a JSON string
	 * @param {string} boardLike JSON representation of board.
	 * @throws {InvalidBoardError} If `boardLike` is not a valid JSON string.
	 * @example
	 * const boardJSON = JSON.stringify(boardInstance)
	 * const newBoardInstance = Board.from(boardJSON)
	 */
	static from(boardLike: string): BoardService
	/**
	 * Create instance of Board class from a JSON string
	 * @param {CellJSON[][]} boardLike JSON representation of board.
	 * @throws {InvalidBoardError} If `boardLike` is not a  valid JSON.
	 * @example
	 * const boardJSON = boardInstance.toJSON()
	 * const newBoardInstance = Board.from(boardJSON)
	 */
	static from(boardLike: CellJSON[][]): BoardService
	static from(boardLike: string | CellJSON[][]) {
		const cellJSONs: CellJSON[][] = typeof boardLike === 'string' ? JSON.parse(boardLike) : boardLike

		if (Array.isArray(cellJSONs)) {
			const data = new GridService(cellJSONs).mapGrid<ICell>(({ kind, value, notes }) =>
				kind === CellKinds.Initial
					? new InitialCellService(value as ValidNumbers)
					: new WritableCellService({ kind, value, notes: NotesService.from(notes) })
			)
			return new BoardService(data)
		} else throw new InvalidBoardError(boardLike)
	}

	clear(cellPos: Position) {
		this.#grid = this.#grid.editCell(cellPos, cell => (cell.kind === CellKinds.Initial ? cell : cell.clear()))

		return this
	}

	toJSON() {
		return this.#grid.mapGrid(cell => cell.toJSON()).data
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	toggleNotes(cellPos: Position, num: ValidNumbers) {
		this.#grid = this.#grid.editCell(cellPos, cell => (cell.kind === CellKinds.Initial ? cell : cell.toggleNote(num)))

		return this
	}

	write(cellPos: Position, num: ValidNumbers) {
		if (this.#grid.getCell(cellPos).kind !== CellKinds.Initial)
			this.#grid = this.#grid
				.editCell(cellPos, cell => (cell as IWritableCell).writeValue(num))
				.mapRelated(cellPos, cell => (cell.kind === CellKinds.Initial ? cell : cell.removeNote(num)))

		return this
	}
}
