import type { RequireOne } from '~/share/types'
import { clamp as clampUtil, createArray, Prtcl } from '~/share/utils'

export type Coords1 = 0 | 1 | 2
export type Coords2 = 3 | 4 | 5
export type Coords3 = 6 | 7 | 8
export type Coords = Coords1 | Coords2 | Coords3

type Y<P extends Data, N1 extends number, N2 extends number, N3 extends number> = P['row'] extends Coords1
	? N1
	: P['row'] extends Coords2
		? N2
		: P['row'] extends Coords3
			? N3
			: never

type X<P extends Data, N1 extends number, N2 extends number, N3 extends number> = P['col'] extends Coords1
	? N1
	: P['col'] extends Coords2
		? N2
		: P['col'] extends Coords3
			? N3
			: never

export type GetReg<P extends Data> = number extends P['row']
	? number extends P['col']
		? number
		: P['col'] extends Coords
			? number
			: never
	: P['row'] extends Coords
		? number extends P['col']
			? number
			: Y<P, X<P, 0, 1, 2>, X<P, 3, 4, 5>, X<P, 6, 7, 8>>
		: never

export interface Data {
	readonly col: number
	readonly row: number
}

export class Pos implements Prtcl.IEquals<Pos>, Prtcl.IRelated<readonly ['col', 'reg', 'row']> {
	[Prtcl.relatedProps] = ['col', 'reg', 'row'] as const

	readonly col
	readonly reg
	readonly row

	constructor(data: Data) {
		if (MIN_RANGE > data.row || data.row > MAX_RANGE) throw new Error(`Invalid row: ${data.row}, out of range`)
		if (MIN_RANGE > data.col || data.col > MAX_RANGE) throw new Error(`Invalid col: ${data.col}, out of range`)

		this.col = data.col
		this.reg = Math.floor(data.row / 3) * 3 + Math.floor(data.col / 3)
		this.row = data.row
	}

	[Prtcl.equalsTo](other: Pos) {
		return this.col === other.col && this.row === other.row
	}

	/**
	 * Sum with other position.
	 * @param sumPos The other position.
	 */
	sum(sumPos: RequireOne<Data>): Pos
	sum({ row = MIN_RANGE, col = MIN_RANGE }: RequireOne<Data>) {
		return clamp({ col: this.col + col, row: this.row + row })
	}

	toJSON() {
		return { col: this.col, row: this.row }
	}

	toString() {
		return `${this.row}-${this.col}` as const
	}
}
/**
 * Abstraction to avoid overhanging from the board.
 * @param pos The position Data.
 * @returns The original position if it does not exceed the limits, otherwise the limit will be returned.
 */
export function clamp(pos: Data) {
	return new Pos({
		row: clampUtil(MIN_RANGE, MAX_RANGE, pos.row),
		col: clampUtil(MIN_RANGE, MAX_RANGE, pos.col),
	})
}

/**
 * Create a bidimensional array with the length selected.
 * @param length The matrix length in both directions.
 * @param mapFn The mapping function.
 * @returns The new matrix with the length defined.
 */
export function createMatrix<const L extends number, MapFn extends (pos: Pos) => any>(length: L, mapFn: MapFn) {
	return createArray(length, row => createArray(length, (col): ReturnType<MapFn> => mapFn(new Pos({ row, col }))))
}

/**
 * Get the position from a region index.
 * @param index The box index of the cell.
 * @returns The initial position of the region.
 */
export function fromReg(index: number) {
	return new Pos({ row: index % 3, col: Math.floor(index / 3) })
}

/**
 * Creates an iterator in two dimensions.
 * @param length To where it will iterate in both directions.
 * @yields The current position.
 */
export function* iterateMatrix(length: number) {
	for (let row = 0; row < length; row++) for (let col = 0; col < length; col++) yield new Pos({ row, col })
}
/** The maximum range for row and column coordinates. */
export const MAX_RANGE = 8
/** The minimum range for row and column coordinates. */
export const MIN_RANGE = 0

/** The initial position. */
export const IDLE = new Pos({ row: MIN_RANGE, col: MIN_RANGE })
