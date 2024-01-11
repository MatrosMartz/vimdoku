import type { RequireOne } from '~/share/types'
import { inject } from '~/share/utils'

import { type IPos, type Pos, POS_MAX_RANGE, POS_MIN_RANGE } from '../models'
import { PosObs } from './position-obs.service'

/** Represent a Position Service. */
export class PosSvc implements IPos {
	readonly #obs = inject(PosObs)

	get data(): Pos {
		return this.#obs.data
	}

	/**
	 * Check if two positions are related.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static areRelated(pos1: Pos, pos2: Pos) {
		return PosSvc.equalsCol(pos1, pos2) || PosSvc.equalsRow(pos1, pos2) || PosSvc.equalsReg(pos1, pos2)
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
	 * Check if two cell positions are in the same region.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static equalsReg(pos1: Pos, pos2: Pos) {
		return PosSvc.equalsPos(PosSvc.getInitsReg(pos1), PosSvc.getInitsReg(pos2))
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
	 * Get the initial position of the region that contains a cell.
	 * @param position The position of the cell.
	 * @returns The initial position of the region.
	 */
	static getInitsReg(position: Pos): Pos
	static getInitsReg({ y, x }: Pos): Pos {
		return { y: Math.floor(y / 3) * 3, x: Math.floor(x / 3) * 3 }
	}

	/**
	 * Get the position from a region index.
	 * @param index The box index of the cell.
	 * @returns The initial position of the region.
	 */
	static getPosFromReg(index: number): Pos {
		return { y: index % 3, x: Math.floor(index / 3) }
	}

	/**
	 * Get the region number (0-8) for a given cell position.
	 * @param pos The position of the cell.
	 * @returns The box number for the cell.
	 */
	static getRegFromPos(pos: Pos) {
		const { y, x } = PosSvc.getInitsReg(pos)
		return y + (x + 3)
	}

	static parseString(pos: Pos) {
		return `${pos.y}-${pos.x}` as const
	}

	/**
	 * Sum two cell positions.
	 * @param pos1 The first cell position.
	 * @param pos2 The second cell position.
	 */
	static sumPos(pos1: Pos, pos2: Pos): Pos {
		return { y: pos1.y + pos2.y, x: pos1.x + pos2.x }
	}

	moveDown(times: number) {
		this.#obs.update(({ y, x }) => ({
			y: Math.min(POS_MAX_RANGE, y + times),
			x: y === POS_MAX_RANGE ? POS_MAX_RANGE : x,
		}))
		return this
	}

	moveLeft(times: number) {
		this.#obs.update(({ y, x }) => ({ y, x: Math.max(POS_MIN_RANGE, x - times) }))
		return this
	}

	moveRight(times: number) {
		this.#obs.update(({ y, x }) => ({ y, x: Math.min(POS_MAX_RANGE, x + times) }))
		return this
	}

	moveUp(times: number) {
		this.#obs.update(({ y, x }) => ({
			y: Math.max(POS_MIN_RANGE, y - times),
			x: y === POS_MIN_RANGE ? POS_MIN_RANGE : x,
		}))
		return this
	}

	set({ y, x }: RequireOne<Pos>) {
		this.#obs.update(pos => ({ y: y ?? pos.y, x: x ?? pos.x }))
		return this
	}
}
