import { InvalidBoardError } from '~/utils'

import { type CellJSON, CellKinds, type ICell, InitialCell, type IWritableCell, WritableCell } from './cell.model'
import { CellNotes, type ValidNumbers } from './cell-notes.model'
import { DifficultyKinds } from './difficulties.model'
import { type ISudokuGrid, SudokuGrid } from './grid.model'
import type { Position } from './position.model'
import { type ISolution, Solution } from './solution.model'

export type BoardData = ISudokuGrid<ICell>

export interface BoardOpts {
	/** Number of initials cells (optional). */
	difficulty?: DifficultyKinds
	/** Sudoku solution (optional). */
	solution?: ISolution
}

export interface IBoard {
	/**
	 * Remove value and clear note set.
	 * @param {Position} cellPos Position of the cell to be cleared.
	 */
	clear(cellPos: Position): this
	/** Get the current cells of board. */
	get data(): BoardData
	/** Convert Board instance in JSON. */
	toJSON(): CellJSON[][]
	/** Convert the Board instance to a JSON string. */
	toString(): string
	/**
	 * Toggle a note in the Notes class (add if not present, remove if present).
	 * @param {Position} cellPos Position of the cell to which the notes are to be toggled.
	 * @param {ValidNumbers} num The note to toggle (1 to 9).
	 */
	toggleNotes(cellPos: Position, num: ValidNumbers): this
	/**
	 * Toggle a cell value (add if not present, remove if present).
	 * @param {Position} cellPos Position of the cell to which the value is changed.
	 * @param {ValidNumbers} num The note add (1 to 9).
	 */
	write(cellPos: Position, num: ValidNumbers): this
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

	clear(cellPos: Position) {
		this.#data = this.#data.editCell(cellPos, cell => (cell.kind === CellKinds.Initial ? cell : cell.clear()))

		return this
	}

	toJSON() {
		return this.#data.mapGrid(cell => cell.toJSON()).data
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	toggleNotes(cellPos: Position, num: ValidNumbers) {
		this.#data = this.#data.editCell(cellPos, cell => (cell.kind === CellKinds.Initial ? cell : cell.toggleNote(num)))

		return this
	}

	write(cellPos: Position, num: ValidNumbers) {
		if (this.#data.getCell(cellPos).kind !== CellKinds.Initial)
			this.#data = this.#data
				.editCell(cellPos, cell => (cell as IWritableCell).writeValue(num))
				.mapRelated(cellPos, cell => (cell.kind === CellKinds.Initial ? cell : cell.removeNote(num)))

		return this
	}
}
