import type { RequireOne } from '~/share/types'
import { clamp, createArray } from '~/share/utils'

export interface PosData {
	x: number
	y: number
}

/** Represent a Position. */
export class Pos<const P extends PosData = PosData> {
	readonly #x: P['y']
	readonly #y: P['x']

	constructor(data: P) {
		this.#x = data.x
		this.#y = data.y
	}

	/**
	 * Get the initial position of the region that contains a cell.
	 * @returns The initial position of the region.
	 */
	get initReg() {
		return new Pos({ y: Math.floor(this.#y / 3) * 3, x: Math.floor(this.#x / 3) * 3 })
	}

	get reg() {
		return this.#y + (this.#x + 3)
	}

	get x() {
		return this.#x
	}

	get y() {
		return this.#y
	}

	/**
	 * Create a bidimensional array with the length selected.
	 * @param length The matrix length in both directions.
	 * @param mapFn The mapping function.
	 * @returns The new matrix with the length defined.
	 */
	static createMatrix<const L extends number, MapFn extends (pos: Pos) => any>(length: L, mapFn: MapFn) {
		return createArray(length, y => createArray(length, (x): ReturnType<MapFn> => mapFn(new Pos({ y, x }))))
	}

	/**
	 * Get the position from a region index.
	 * @param index The box index of the cell.
	 * @returns The initial position of the region.
	 */
	static fromReg(index: number) {
		return new Pos({ y: index % 3, x: Math.floor(index / 3) })
	}

	/**
	 * Creates an iterator in two dimensions.
	 * @param length To where it will iterate in both directions.
	 * @yields The current position.
	 */
	static *iterateMatrix(length: number) {
		for (let y = 0; y < length; y++) for (let x = 0; x < length; x++) yield new Pos({ y, x })
	}

	/**
	 * Check if other pos are related.
	 * @param pos The other position.
	 * @returns True if the other position belongs to the same col, region or row.
	 */
	areRelated(pos: Pos) {
		return this.equalsCol(pos) || this.equalsRow(pos) || this.equalsReg(pos)
	}

	/**
	 * Check if other position are in the same column.
	 * @param pos The other position.
	 * @returns True if the other position belongs to the same col.
	 */
	equalsCol(pos: Pos) {
		return this.#x === pos.#x
	}

	/**
	 * Check if other position are the same.
	 * @param pos The other position.
	 * @returns True if the other position is the same.
	 */
	equalsPos(pos: Pos) {
		return this.#y === pos.#y && this.#x === pos.#x
	}

	/**
	 * Check if other position are in the same region.
	 * @param pos The other position.
	 * @returns True if the other position belongs to the same region.
	 */
	equalsReg(pos: Pos) {
		return this.initReg.equalsPos(pos.initReg)
	}

	/**
	 * Check if other position are in the same row.
	 * @param pos The other position.
	 * @returns True if the other position belongs to the same row.
	 */
	equalsRow(pos: Pos) {
		return this.#y === pos.#y
	}

	/**
	 * Sum with other position.
	 * @param pos The other position.
	 */
	sum(pos: RequireOne<PosData>): Pos
	sum({ y = POS_MIN_RANGE, x = POS_MIN_RANGE }: RequireOne<PosData>) {
		return new Pos({ y: this.#clamp(this.#y + y), x: this.#clamp(this.#x + x) })
	}

	toString() {
		return `${this.#y}-${this.#x}` as const
	}

	/**
	 * Abstraction to avoid overhanging from the board,
	 * @param value The original value.
	 * @returns The original position if it does not exceed the limits, otherwise the limit will be returned.
	 */
	#clamp(value: number) {
		return clamp(POS_MIN_RANGE, POS_MAX_RANGE, value)
	}
}

/** The maximum range for row and column coordinates. */
export const POS_MAX_RANGE = 8
/** The minimum range for row and column coordinates. */
export const POS_MIN_RANGE = 0

/** The initial position. */
export const IDLE_POS = new Pos({ y: POS_MIN_RANGE, x: POS_MIN_RANGE })
