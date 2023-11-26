import type { RequireOne } from '~/share/types'

import type { IPos, Pos } from '../models'

/** Represent a Position Service. */
export class PosSvc implements IPos {
	/** The default position value.. */
	static readonly IDLE_POS: Pos = { x: 0, y: 0 }
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
	constructor(pos?: Partial<Pos>)
	constructor({ y = 0, x = 0 }: Partial<Pos> = {}) {
		this.#x = x
		this.#y = y
	}

	get data(): Pos {
		return { y: this.#y, x: this.#x }
	}

	/**
	 * Check if two positions are related.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static areRelated(pos1: Pos, pos2: Pos) {
		return PosSvc.equalsCol(pos1, pos2) || PosSvc.equalsRow(pos1, pos2) || PosSvc.equalsBox(pos1, pos2)
	}

	/**
	 * Check if two cell positions are in the same box.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsBox(pos1: Pos, pos2: Pos) {
		return PosSvc.equalsPos(PosSvc.getInitsBox(pos1), PosSvc.getInitsBox(pos2))
	}

	/**
	 * Check if two cell positions are in the same column.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsCol(pos1: Pos, pos2: Pos) {
		return pos1.x === pos2.x
	}

	/**
	 * Check if two cell positions are the same.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsPos(pos1: Pos, pos2: Pos) {
		return pos1.y === pos2.y && pos1.x === pos2.x
	}

	/**
	 * Check if two cell positions are in the same row.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsRow(pos1: Pos, pos2: Pos) {
		return pos1.y === pos2.y
	}

	/**
	 * Get the box number (0-8) for a given cell position.
	 * @param pos The position of the cell.
	 * @returns The box number for the cell.
	 */
	static getBoxFromPos(pos: Pos) {
		const { y, x } = PosSvc.getInitsBox(pos)
		return y + (x + 3)
	}

	/**
	 * Get the initial position of the box that contains a cell.
	 * @param position The position of the cell.
	 * @returns The initial position of the box.
	 */
	static getInitsBox(position: Pos): Pos
	static getInitsBox({ y, x }: Pos): Pos {
		return { y: Math.ceil(y / 3) * 3, x: Math.ceil(x / 3) * 3 }
	}

	/**
	 * Get the position from a box index.
	 * @param index The box index of the cell.
	 * @returns The initial position of the box.
	 */
	static getPosFromBox(index: number): Pos {
		return { y: index % 3, x: Math.ceil(index / 3) }
	}

	/**
	 * Sum two cell positions.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static sumPos(pos1: Pos, pos2: Pos): Pos {
		return { y: pos1.y + pos2.y, x: pos1.x + pos2.x }
	}

	change({ y, x }: RequireOne<Pos>) {
		if (x != null) this.#x = x
		if (y != null) this.#y = y
		return this
	}

	moveDown(times: number) {
		if (this.#y === PosSvc.MAX_RANGE) this.#x = PosSvc.MAX_RANGE
		else this.#y = Math.min(PosSvc.MAX_RANGE, this.#y + times)
		return this
	}

	moveLeft(times: number) {
		this.#x = Math.max(PosSvc.MIN_RANGE, this.#x - times)
		return this
	}

	moveRight(times: number) {
		this.#x = Math.min(PosSvc.MAX_RANGE, this.#x + times)
		return this
	}

	moveUp(times: number) {
		if (this.#y === PosSvc.MIN_RANGE) this.#x = PosSvc.MIN_RANGE
		else this.#y = Math.max(PosSvc.MIN_RANGE, this.#y - times)
		return this
	}
}
