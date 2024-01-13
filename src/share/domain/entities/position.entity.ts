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

	/**
	 * Get the region number (0-8) for a given cell position.
	 * @param pos The position of the cell.
	 * @returns The box number for the cell.
	 */
	get reg() {
		return this.#y + (this.#x + 3)
	}

	/** Get the current x coord. */
	get x() {
		return this.#x
	}

	/** Get the current y coord. */
	get y() {
		return this.#y
	}

	/**
	 * Create a bidimensional array with the length selected.
	 * @param length The matrix length in both directions.
	 * @param mapFn The mapping function.
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
	 */
	static *iterateMatrix(length: number) {
		for (let y = 0; y < length; y++) for (let x = 0; x < length; x++) yield new Pos({ y, x })
	}

	/**
	 * Check if two positions are related.
	 * @param pos The second cell position.
	 */
	areRelated(pos: Pos) {
		return this.equalsCol(pos) || this.equalsRow(pos) || this.equalsReg(pos)
	}

	/**
	 * Check if two cell positions are in the same column.
	 * @param pos The second cell position.
	 */
	equalsCol(pos: Pos) {
		return this.#x === pos.#x
	}

	/**
	 * Check if two cell positions are the same.
	 * @param pos The second cell position.
	 */
	equalsPos(pos: Pos) {
		return this.#y === pos.#y && this.#x === pos.#x
	}

	/**
	 * Check if two cell positions are in the same region.
	 * @param pos The second cell position.
	 */
	equalsReg(pos: Pos) {
		return this.initReg.equalsPos(pos.initReg)
	}

	/**
	 * Check if two cell positions are in the same row.
	 * @param pos The second cell position.
	 */
	equalsRow(pos: Pos) {
		return this.#y === pos.#y
	}

	/**
	 * Sum two cell positions.
	 * @param pos The second cell position.
	 */
	sum(pos: RequireOne<PosData>): Pos
	sum({ y = POS_MIN_RANGE, x = POS_MIN_RANGE }: RequireOne<PosData>) {
		return new Pos({ y: this.#clamp(this.#y + y), x: this.#clamp(this.#x + x) })
	}

	toString() {
		return `${this.#y}-${this.#x}` as const
	}

	#clamp(value: number) {
		return clamp(POS_MIN_RANGE, POS_MAX_RANGE, value)
	}
}

/** The maximum range for row and column coordinates. */
export const POS_MAX_RANGE = 8
/** The minimum range for row and column coordinates. */
export const POS_MIN_RANGE = 0

export const IDLE_POS = new Pos({ y: POS_MIN_RANGE, x: POS_MIN_RANGE })
