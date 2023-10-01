import type { RequireOne } from '~/share/utils'

import type { IPosition, Position } from '../models'

/** Represent a Position Service. */
export class PositionService implements IPosition {
	/** The maximum range for row and column coordinates. */
	static readonly MAX_RANGE = 9
	/** The minimum range for row and column coordinates. */
	static readonly MIN_RANGE = 0

	#col
	#row

	/**
	 * Creates an instance of the Position class.
	 * @param pos Initial Sudoku board.
	 */
	constructor(pos?: Partial<Position>)
	constructor({ row = 0, col = 0 }: Partial<Position> = {}) {
		this.#col = col
		this.#row = row
	}

	get value(): Position {
		return { row: this.#row, col: this.#col }
	}

	/**
	 * Check if two cell positions are in the same box.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsBox(pos1: Position, pos2: Position) {
		return PositionService.getBoxFromPos(pos1) === PositionService.getBoxFromPos(pos2)
	}

	/**
	 * Check if two cell positions are in the same column.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsCol(pos1: Position, pos2: Position) {
		return pos1.col === pos2.col
	}

	/**
	 * Check if two cell positions are the same.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsPos(pos1: Position, pos2: Position) {
		return pos1.row === pos2.row && pos1.col === pos2.col
	}

	/**
	 * Check if two cell positions are in the same row.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsRow(pos1: Position, pos2: Position) {
		return pos1.row === pos2.row
	}

	/**
	 * Get the box number (0-8) for a given cell position.
	 * @param pos The position of the cell.
	 * @returns The box number for the cell.
	 */
	static getBoxFromPos(pos: Position) {
		const { row, col } = PositionService.getInitsBox(pos)
		return row + (col + 3)
	}

	/**
	 * Get the initial position of the box that contains a cell.
	 * @param position The position of the cell.
	 * @returns The initial position of the box.
	 */
	static getInitsBox(position: Position): Position
	static getInitsBox({ row, col }: Position): Position {
		return { row: Math.ceil(row / 3) * 3, col: Math.ceil(col / 3) * 3 }
	}

	/**
	 * Get the position from a box index.
	 * @param index The box index of the cell.
	 * @returns The initial position of the box.
	 */
	static getPosFromBox(index: number): Position {
		return { row: index % 3, col: Math.ceil(index / 3) }
	}

	/**
	 * Sum two cell positions.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static sumPos(pos1: Position, pos2: Position): Position {
		return { row: pos1.row + pos2.row, col: pos1.col + pos2.col }
	}

	change({ row, col }: RequireOne<Position>) {
		if (col != null) this.#col = col
		if (row != null) this.#row = row
		return this
	}

	moveDown(times: number) {
		this.#row = Math.min(PositionService.MAX_RANGE, this.#row + times)
		return this
	}

	moveLeft(times: number) {
		this.#col = Math.max(PositionService.MIN_RANGE, this.#col - times)
		return this
	}

	moveRight(times: number) {
		this.#col = Math.min(PositionService.MAX_RANGE, this.#col + times)
		return this
	}

	moveUp(times: number) {
		this.#row = Math.max(PositionService.MIN_RANGE, this.#row - times)
		return this
	}
}
