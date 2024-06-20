import { beforeEach, describe, expect, test, vi } from 'vitest'

import { mockSingleton } from '~/share/utils'

import { Pos } from '../entities'
import { PosSvc } from './position.service'
import { PosObs } from './position-obs.service'

interface PosTestCtx {
	posObsMock: PosObs
	posSvc: PosSvc
}

beforeEach<PosTestCtx>(ctx => {
	ctx.posObsMock = mockSingleton(PosObs, () => {
		const mock = new PosObs()

		Object.defineProperties(mock, {
			add: { value: vi.fn(mock.add) },
			remove: { value: vi.fn(mock.remove) },
			set: { value: vi.fn(mock.set) },
			update: { value: vi.fn(mock.update) },
		})

		return mock
	})

	ctx.posSvc = new PosSvc()

	return () => vi.clearAllMocks()
})

describe('PosObs', () => {
	test<PosTestCtx>('Should call the observer with the new position', ({ posSvc, posObsMock }) => {
		posSvc.set(new Pos.Pos({ col: 3, row: 4 }))

		expect(posObsMock.set).toBeCalledTimes(1)
		expect(posObsMock.set).toBeCalledWith(new Pos.Pos({ col: 3, row: 4 }))
	})

	test<PosTestCtx>('Should call the observer with two rows down', ({ posSvc, posObsMock }) => {
		posSvc.moveDown(2)

		expect(posObsMock.set).toBeCalledTimes(1)
		expect(posObsMock.set).toBeCalledWith(new Pos.Pos({ col: 0, row: 2 }))
	})

	test<PosTestCtx>('Should call the observer with the last row if times are greated than Pos.MAX_RANGE', ({
		posSvc,
		posObsMock,
	}) => {
		posSvc.moveDown(Pos.MAX_RANGE + 1)

		expect(posObsMock.set).toBeCalledWith(new Pos.Pos({ col: 0, row: Pos.MAX_RANGE }))
	})

	test<PosTestCtx>('Should call the observer with the fisrt row if times are less than Pos.MIN_RANGE', ({
		posSvc,
		posObsMock,
	}) => {
		posSvc.moveUp(Pos.MAX_RANGE + 1)

		expect(posObsMock.set).toBeCalledWith(new Pos.Pos({ col: 0, row: Pos.MIN_RANGE }))
	})

	test<PosTestCtx>('Should call the observer with the last col if times are greated than Pos.MAX_RANGE', ({
		posSvc,
		posObsMock,
	}) => {
		posSvc.moveRight(Pos.MAX_RANGE + 1)

		expect(posObsMock.set).toBeCalledWith(new Pos.Pos({ row: 0, col: Pos.MAX_RANGE }))
	})

	test<PosTestCtx>('Should call the observer with the fisrt col if times are less than Pos.MIN_RANGE', ({
		posSvc,
		posObsMock,
	}) => {
		posSvc.moveLeft(Pos.MAX_RANGE + 1)

		expect(posObsMock.set).toBeCalledWith(new Pos.Pos({ row: 0, col: Pos.MIN_RANGE }))
	})
})
