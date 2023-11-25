import type { RequireOne } from '~/share/types'

import type { IPosition, Position } from '../models'

/** Represent a Position Service. */
export class PositionService implements IPosition {
	/** The default position value.. */
	static readonly IDLE_POS: Position = { x: 0, y: 0 }
	/** The maximum range for row and column coordinates. */
	static readonly MAX_RANGE = 8
	/** The minimum range for row and column coordinates. */
	static readonly MIN_RANGE = 0

	#x
	#y

	/**
	 * Creates an instance of the Position class.
	 * @param pos Initial Sudoku board.
	 */
	constructor(pos?: Partial<Position>)
	constructor({ y = 0, x = 0 }: Partial<Position> = {}) {
		this.#x = x
		this.#y = y
	}

	get data(): Position {
		return { y: this.#y, x: this.#x }
	}

	/**
	 * Check if two positions are related.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static areRelated(pos1: Position, pos2: Position) {
		return (
			PositionService.equalsCol(pos1, pos2) ||
			PositionService.equalsRow(pos1, pos2) ||
			PositionService.equalsBox(pos1, pos2)
		)
	}

	/**
	 * Check if two cell positions are in the same box.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsBox(pos1: Position, pos2: Position) {
		return PositionService.equalsPos(PositionService.getInitsBox(pos1), PositionService.getInitsBox(pos2))
	}

	/**
	 * Check if two cell positions are in the same column.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsCol(pos1: Position, pos2: Position) {
		return pos1.x === pos2.x
	}

	/**
	 * Check if two cell positions are the same.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsPos(pos1: Position, pos2: Position) {
		return pos1.y === pos2.y && pos1.x === pos2.x
	}

	/**
	 * Check if two cell positions are in the same row.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsRow(pos1: Position, pos2: Position) {
		return pos1.y === pos2.y
	}

	/**
	 * Get the box number (0-8) for a given cell position.
	 * @param pos The position of the cell.
	 * @returns The box number for the cell.
	 */
	static getBoxFromPos(pos: Position) {
		const { y, x } = PositionService.getInitsBox(pos)
		return y + (x + 3)
	}

	/**
	 * Get the initial position of the box that contains a cell.
	 * @param position The position of the cell.
	 * @returns The initial position of the box.
	 */
	static getInitsBox(position: Position): Position
	static getInitsBox({ y, x }: Position): Position {
		return { y: Math.ceil(y / 3) * 3, x: Math.ceil(x / 3) * 3 }
	}

	/**
	 * Get the position from a box index.
	 * @param index The box index of the cell.
	 * @returns The initial position of the box.
	 */
	static getPosFromBox(index: number): Position {
		return { y: index % 3, x: Math.ceil(index / 3) }
	}

	/**
	 * Sum two cell positions.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static sumPos(pos1: Position, pos2: Position): Position {
		return { y: pos1.y + pos2.y, x: pos1.x + pos2.x }
	}

	change({ y, x }: RequireOne<Position>) {
		if (x != null) this.#x = x
		if (y != null) this.#y = y
		return this
	}

	moveDown(times: number) {
		if (this.#y === PositionService.MAX_RANGE) this.#x = PositionService.MAX_RANGE
		else this.#y = Math.min(PositionService.MAX_RANGE, this.#y + times)
		return this
	}

	moveLeft(times: number) {
		this.#x = Math.max(PositionService.MIN_RANGE, this.#x - times)
		return this
	}

	moveRight(times: number) {
		this.#x = Math.min(PositionService.MAX_RANGE, this.#x + times)
		return this
	}

	moveUp(times: number) {
		if (this.#y === PositionService.MIN_RANGE) this.#x = PositionService.MIN_RANGE
		else this.#y = Math.max(PositionService.MIN_RANGE, this.#y - times)
		return this
	}
}
