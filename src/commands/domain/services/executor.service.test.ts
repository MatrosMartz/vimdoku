import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import type { IMediator, Mediator } from '../models'
import { ExecutorService } from './executor.service'

const mockMediator: IMediator = {
	dispatch(action: Mediator.Actions, data?: Record<string, unknown>) {
		return this
	},
	get(key) {
		return null as Mediator.State[typeof key]
	},
	async load() {},
	subscribe(key, observer) {
		return () => {}
	},
}

let executor: ExecutorService

beforeAll(() => {
	vi.useFakeTimers()

	return () => vi.useRealTimers()
})

beforeEach(() => {
	executor = new ExecutorService({ mediator: mockMediator })
})

describe.concurrent('ExecutorService suggestions', () => {
	test('Should be the initial suggestions length are zero', () => {
		expect(executor.get('suggestions')).length(0)
	})

	test('Should be every suggestions start with "help"', () => {
		executor.searchAutocomplete('help')

		vi.advanceTimersByTime(500)

		expect(executor.get('suggestions').every(({ id }) => id.startsWith('help'))).toBe(true)
	})

	test('Should be first suggestions are help commands', () => {
		executor.searchAutocomplete('help :')

		vi.advanceTimersByTime(500)

		expect(executor.get('suggestions').every(({ input }) => input.startsWith('help :'))).toBe(true)
	})

	test('Should be first suggestion are "help :help"', () => {
		executor.searchAutocomplete('help :help')

		vi.advanceTimersByTime(500)

		expect(executor.get('suggestions')).length(1)

		expect(executor.get('suggestions')[0].id).toBe('help-cmd-help')
	})

	test('Should be if search empty string suggestions length are zero', () => {
		executor.searchAutocomplete('help :help')

		vi.advanceTimersByTime(500)

		executor.searchAutocomplete('')

		vi.advanceTimersByTime(500)

		expect(executor.get('suggestions')).length(0)
	})
})
