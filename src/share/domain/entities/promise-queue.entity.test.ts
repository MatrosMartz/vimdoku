import { beforeAll, describe, expect, test, vi } from 'vitest'

import { sleep } from '~/share/utils'

import { PromiseFnQueue } from './promise-queue.entity'

beforeAll(() => {
	vi.useFakeTimers()

	return () => {
		vi.useRealTimers()
	}
})
const ms = 500

describe.concurrent('PromiseFnQueue', () => {
	test('Should empty queue', () => {
		const queue = new PromiseFnQueue()

		expect(queue.lenght).toBe(0)
	})

	test('Should add the queue', () => {
		const queue = new PromiseFnQueue()
		const item = vi.fn()

		queue.add(item)
		expect(queue.lenght).toBe(1)
	})

	test('Should add and run if the queue is empty', async () => {
		const queue = new PromiseFnQueue()
		const item = vi.fn()

		queue.add(item)
		expect(item).toBeCalledTimes(1)
		await vi.advanceTimersByTimeAsync(0)
		expect(queue.lenght).toBe(0)
	})

	test('Should add without running it if the queue is busy', () => {
		const queue = new PromiseFnQueue()
		const item = vi.fn()

		queue.add(() => sleep(ms)).add(item)

		expect(item).not.toBeCalled()
		expect(queue.lenght).toBe(2)
	})

	test('Should run after finishing the previous', async () => {
		const queue = new PromiseFnQueue()
		const item = vi.fn()

		queue.add(() => sleep(ms)).add(item)
		await vi.advanceTimersByTimeAsync(ms)
		expect(item).toBeCalledTimes(1)
		expect(queue.lenght).toBe(0)
	})

	test('The errorHandler should catch all errors', async () => {
		const errorHandler = vi.fn()
		const queue = new PromiseFnQueue(errorHandler)

		queue
			.add(() => {
				throw new Error("I'm falied!")
			})
			.add(() => {
				throw new Error('Me too ):')
			})

		await vi.advanceTimersByTimeAsync(0)
		expect(errorHandler).toBeCalledTimes(2)
	})

	test('The errorHandler should be called with the error', async () => {
		const errorHandler = vi.fn()
		const error = new Error("I'm falied!")
		const queue = new PromiseFnQueue(errorHandler)

		queue.add(() => {
			throw error
		})

		await vi.advanceTimersByTimeAsync(0)
		expect(errorHandler).toBeCalledWith(error)
	})
})
