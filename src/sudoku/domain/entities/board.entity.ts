import { createMatrix, InvalidBoardError } from '~/utils'

import { type CellJSON, CellKinds, type CellValue } from './cell.entity'
import { DifficultyKinds } from './difficulties.entity'
import { Notes } from './notes.entity'
import type { Position } from './position.entity'
import { Solution } from './solution.entity'

export type BoardValue = CellValue[][]

export interface BoardOpts {
	/** Number of initials cells (optional). */
	difficulty?: DifficultyKinds
	/** Sudoku solution (optional). */
	solution?: Solution
}

export interface BoardInitOpts {
	/** Initial Sudoku board (optional). */
	initBoard?: BoardValue
}

export interface IBoard {
	/** Get the current cells of board */
	get value(): BoardValue
}

/** Represent a Sudoku Board. */
export class Board implements IBoard {
	#value

	/**
	 * Creates an instance of the Board class.
	 * @throws {InvalidBoardError} If `opts.initBoard` is invalid.
	 */
	constructor(opts?: BoardInitOpts)
	constructor({
		initBoard = Board.#fill({ difficulty: DifficultyKinds.Beginner, solution: new Solution() }),
	}: BoardInitOpts = {}) {
		this.#value = initBoard
	}

	get value() {
		return structuredClone(this.#value)
	}

	/**
	 * Create new instance of Board class with options.
	 * @param {BoardOpts} [opts] Options for create board (optional).
	 */
	static create(opts?: BoardOpts): Board
	static create({ difficulty = DifficultyKinds.Beginner, solution = new Solution() }: BoardOpts = {}) {
		return new Board({ initBoard: Board.#fill({ difficulty, solution }) })
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
		if (typeof boardLike === 'string') {
			const initBoard = JSON.parse(boardLike, (key, value) =>
				key !== 'notes' ? value : new Notes({ initNotes: value })
			)
			return new Board({ initBoard })
		}
		if (Array.isArray(boardLike) && boardLike.every(rows => Array.isArray(rows))) {
			const initBoard = boardLike.map(rows =>
				rows.map<CellValue>(cell => ({ ...cell, notes: new Notes({ initNotes: cell.notes }) }))
			)
			return new Board({ initBoard })
		}
		throw new InvalidBoardError(boardLike)
	}

	/**
	 * Fill in the Sudoku cells from the board options.
	 * @private
	 */
	static #fill({ difficulty, solution }: Required<BoardOpts>) {
		let initials = 0
		const createBox = ({ row, col }: Position): CellValue => {
			const isInitial = Boolean(Math.random() * 2) && initials < difficulty
			if (!isInitial)
				return {
					kind: CellKinds.Empty,
					value: 0,
					notes: new Notes(),
				}
			initials++
			return {
				kind: CellKinds.Initial,
				value: solution.value[row][col],
				notes: new Notes(),
			}
		}
		return createMatrix<CellValue>(9, { fn: createBox })
	}

	/** Convert Board instance in JSON */
	toJSON() {
		return this.#map<CellJSON>(cell => ({ ...cell, notes: cell.notes.toJSON() }))
	}

	/** Convert the Board instance to a JSON string. */
	toString() {
		return JSON.stringify(this.toJSON())
	}

	/**
	 * Calls the function defined on each Cells of the board and returns matrix or board that contains the results.
	 * @private
	 */
	#map<T>(fn: (cell: CellValue, pos: Position) => T) {
		return this.#value.map((cols, row) => cols.map((box, col) => fn(box, { row, col })))
	}
}
