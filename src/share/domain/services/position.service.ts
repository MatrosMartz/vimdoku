import type { RequireOne } from '~/share/types'
import { inject } from '~/share/utils'

import { Pos, POS_MAX_RANGE, POS_MIN_RANGE } from '../entities'
import type { IPos } from '../models/position.model'
import { PosObs } from './position-obs.service'

/** Represent a Position Service. */
export class PosSvc implements IPos {
	readonly #obs = inject(PosObs)

	get data(): Pos {
		return this.#obs.data
	}

	moveDown(times: number) {
		this.#obs.update(
			({ y, x }) => new Pos({ y: Math.min(POS_MAX_RANGE, y + times), x: y === POS_MAX_RANGE ? POS_MAX_RANGE : x })
		)
		return this
	}

	moveLeft(times: number) {
		this.#obs.update(({ y, x }) => new Pos({ y, x: Math.max(POS_MIN_RANGE, x - times) }))
		return this
	}

	moveRight(times: number) {
		this.#obs.update(({ y, x }) => new Pos({ y, x: Math.min(POS_MAX_RANGE, x + times) }))
		return this
	}

	moveUp(times: number) {
		this.#obs.update(
			({ y, x }) =>
				new Pos({
					y: Math.max(POS_MIN_RANGE, y - times),
					x: y === POS_MIN_RANGE ? POS_MIN_RANGE : x,
				})
		)
		return this
	}

	set({ y, x }: RequireOne<Pos>) {
		this.#obs.update(pos => new Pos({ y: y ?? pos.y, x: x ?? pos.x }))
		return this
	}
}
