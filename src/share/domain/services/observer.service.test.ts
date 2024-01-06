import { beforeEach, describe, expect, test, vi } from 'vitest'

import { noop } from '~/share/utils'

import { HistoryObsSvc, ObsSvc } from './observer.service'

describe.concurrent('Obs Svc', () => {
	let obs: ObsSvc<number>

	beforeEach(() => {
		obs = new ObsSvc(9)
	})

	test('Should be the initial data.', () => {
		expect(obs.data).toBe(9)
	})

	test('Should call it once when adding it.', () => {
		const observer = vi.fn(noop)
		obs.add(observer)

		expect(observer).toHaveBeenCalledOnce()
		expect(observer).toHaveBeenCalledWith(9)
	})

	test('Should call it when setting the data.', () => {
		const observer = vi.fn(noop)
		obs.add(observer)
		obs.set(5)

		expect(observer).toHaveBeenCalledTimes(2)
		expect(observer).toHaveBeenNthCalledWith(1, 9)
		expect(observer).toHaveBeenNthCalledWith(2, 5)
	})

	test('Should call with the lasted data.', () => {
		const observer = vi.fn(noop)
		obs.set(5)
		obs.add(observer)

		expect(observer).toHaveBeenCalledOnce()
		expect(observer).toHaveBeenCalledWith(5)
	})

	test('Should call it when updating the data.', () => {
		const observer = vi.fn(noop)
		obs.add(observer)
		obs.update(n => n + 5)

		expect(observer).toHaveBeenCalledTimes(2)
		expect(observer).toHaveBeenNthCalledWith(1, 9)
		expect(observer).toHaveBeenNthCalledWith(2, 14)
	})

	test('Should not call back after removal.', () => {
		const observer = vi.fn(noop)
		obs.add(observer)

		obs.set(5)
		obs.remove(observer)
		obs.set(10)
		obs.update(n => n + 5)

		expect(observer).toHaveBeenCalledTimes(2)
		expect(observer).toHaveBeenNthCalledWith(1, 9)
		expect(observer).toHaveBeenNthCalledWith(2, 5)
	})
})

describe.concurrent('History Obs Svc', () => {
	const EMPTY_STATE = 0

	test('Should be the empty state.', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 20, [])

		expect(obs.data).toBe(EMPTY_STATE)
	})

	test('History should be empty.', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 20, [])

		expect(obs.history).toEqual([])
	})

	test('Should be the empty state and add the new data to history.', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 20, [])

		obs.push(1)

		expect(obs.data).toBe(EMPTY_STATE)
		expect(obs.history).toEqual([1])
	})

	test('Should be the lasted history data.', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 20, [1, 2])

		obs.undo()

		expect(obs.data).toBe(2)
		expect(obs.history).toEqual([1, 2])
	})

	test('Should be the first data in case it comes to the begin of the history..', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 20, [1, 2])

		obs.undo().undo().undo().undo()

		expect(obs.data).toBe(1)
		expect(obs.history).toEqual([1, 2])
	})

	test('Should be the data after the last undo.', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 20, [1, 2, 3])

		obs.undo().undo().undo().redo()

		expect(obs.data).toBe(2)
	})

	test('Should be the empty state in the case it comes to the end of the history.', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 20, [1, 2])

		obs.undo().redo()

		expect(obs.data).toBe(EMPTY_STATE)
	})

	test('Should overwrite the history from the last undo.', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 20, [1, 2, 3, 4])

		obs.undo().undo().overwrite(10)

		expect(obs.data).toBe(EMPTY_STATE)
		expect(obs.history).toEqual([1, 2, 10])
	})

	test('The history should only contain the same amount of changes as the maximum length of the history.', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 3, [])

		obs.push(1).push(2).push(3).push(4).push(5)

		expect(obs.history).toEqual([3, 4, 5])
	})

	test('Should be called when a data is added.', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 20, [])

		const observer = vi.fn(noop)

		obs.add(observer).push(1)

		expect(observer).toBeCalledTimes(2)
		expect(observer).toHaveBeenNthCalledWith(1, EMPTY_STATE)
		expect(observer).toHaveBeenNthCalledWith(2, EMPTY_STATE)
	})

	test('Should call after undoing the history.', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 20, [1])

		const observer = vi.fn(noop)

		obs.add(observer).undo()

		expect(observer).toBeCalledTimes(2)
		expect(observer).toHaveBeenNthCalledWith(1, EMPTY_STATE)
		expect(observer).toHaveBeenNthCalledWith(2, 1)
	})

	test('Should call it only as many times as it changes the data.', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 20, [1])

		const observer = vi.fn(noop)

		obs.add(observer).undo().undo().undo()

		expect(observer).toBeCalledTimes(2)
		expect(observer).toHaveBeenLastCalledWith(1)
	})

	test('Should only if it has not reached the beginning of the track record.', () => {
		const obs = new HistoryObsSvc<number>(EMPTY_STATE, 20, [1, 2])

		const observer = vi.fn(noop)

		obs.add(observer).undo().undo().redo().redo().redo()

		expect(observer).toBeCalledTimes(5)
		expect(observer).toHaveBeenLastCalledWith(EMPTY_STATE)
	})
})
