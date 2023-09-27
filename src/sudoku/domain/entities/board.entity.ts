import { InvalidBoardError } from '~/utils'

import { type CellJSON, CellKinds, type ICell, InitialCell, WritableCell } from './cell.entity'
import { CellNotes, type ValidNumbers } from './cell-notes.entity'
import { DifficultyKinds } from './difficulties.entity'
import { type ISudokuGrid, SudokuGrid } from './grid.entity'
import { Solution } from './solution.entity'

export type BoardData = ISudokuGrid<ICell>

export interface BoardOpts {
	/** Number of initials cells (optional). */
	difficulty?: DifficultyKinds
	/** Sudoku solution (optional). */
	solution?: Solution
}

export interface IBoard {
	/** Get the current cells of board */
	get data(): BoardData
	/** Convert Board instance in JSON */
	toJSON(): CellJSON[][]
	/** Convert the Board instance to a JSON string. */
	toString(): string
}

/** Represent a Sudoku Board. */
export class Board implements IBoard {
	#data

	/**
	 * Creates an instance of the Board class.
	 * @param {Board} data Initial Sudoku board.
	 */
	constructor(data: BoardData) {
		this.#data = data
	}

	get data() {
		return structuredClone(this.#data)
	}

	/**
	 * Create new instance of Board class with options.
	 * @param {BoardOpts} [opts] Options for create board (optional).
	 */
	static create(opts?: BoardOpts): Board
	static create({ difficulty = DifficultyKinds.Beginner, solution = Solution.create() }: BoardOpts = {}) {
		let initials = 0
		const grid = SudokuGrid.create<ICell>(pos => {
			const isInitial = Boolean(Math.random() * 2) && initials < difficulty
			if (!isInitial) return new WritableCell()

			initials++
			return new InitialCell(solution.data.getCell(pos))
		})

		return new Board(grid)
	}

	/**
	 * Create instance of Board class from a JSON string
	 * @param {string} boardLike JSON representation of board.
	 * @throws {InvalidBoardError} If `boardLike` is not a valid JSON string.
	 * @example
	 * const boardJSON = JSON.stringify(boardInstance)
	 * const newBoardInstance = Board.from(boardJSON)
	 */
	static from(boardLike: string): Board
	/**
	 * Create instance of Board class from a JSON string
	 * @param {CellJSON[][]} boardLike JSON representation of board.
	 * @throws {InvalidBoardError} If `boardLike` is not a  valid JSON.
	 * @example
	 * const boardJSON = boardInstance.toJSON()
	 * const newBoardInstance = Board.from(boardJSON)
	 */
	static from(boardLike: CellJSON[][]): Board
	static from(boardLike: string | CellJSON[][]) {
		const cellJSONs: CellJSON[][] = typeof boardLike === 'string' ? JSON.parse(boardLike) : boardLike

		if (Array.isArray(cellJSONs)) {
			const data = new SudokuGrid(cellJSONs).mapGrid<ICell>(({ kind, value, notes }) =>
				kind === CellKinds.Initial
					? new InitialCell(value as ValidNumbers)
					: new WritableCell({ kind, value, notes: CellNotes.create(notes) })
			)
			return new Board(data)
		} else throw new InvalidBoardError(boardLike)
	}

	toJSON() {
		return this.#data.mapGrid(cell => cell.toJSON()).data
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}
}
