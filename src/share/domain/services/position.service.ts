import type { RequireOne } from '~/share/types'
import { inject } from '~/share/utils'

import { Pos } from '../entities'
import type { IPos } from '../models/position.model'
import { PosObs } from './position-obs.service'

/** Represent a Position Service. */
export class PosSvc implements IPos {
	readonly #obs = inject(PosObs)

	get data(): Pos.Pos {
		return this.#obs.data
	}

	moveDown(times: number) {
		this.#obs.update(pos => pos.sum({ row: times }))
		return this
	}

	moveLeft(times: number) {
		this.#obs.update(pos => pos.sum({ col: -times }))
		return this
	}

	moveRight(times: number) {
		this.#obs.update(pos => pos.sum({ col: times }))
		return this
	}

	moveUp(times: number) {
		this.#obs.update(pos => pos.sum({ row: -times }))
		return this
	}

	set({ col, row }: RequireOne<Pos.Pos>) {
		this.#obs.update(pos => new Pos.Pos({ col: col ?? pos.col, row: row ?? pos.row }))
		return this
	}
}
