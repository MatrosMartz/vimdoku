import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import type { IContext } from '~/share/domain/models'
import { Context, Observable } from '~/share/domain/services'
import { ALL_SUGGESTIONS } from '$cmd/infra/services'

import type { IMediator, Mediator, Suggestion } from '../models'
import { ExecutorService } from './executor.service'

const mockMediator: IMediator = {
	dispatch(action: Mediator.Actions, data?: Record<string, unknown>) {
		return this
	},
	async load() {},
}

let suggsCtx: IContext<Suggestion[]>
let executor: ExecutorService

beforeAll(() => {
	vi.useFakeTimers()

	return () => vi.useRealTimers()
})

beforeEach(() => {
	suggsCtx = new Context(new Observable<Suggestion[]>(), [])
	executor = new ExecutorService({ allSuggestions: ALL_SUGGESTIONS, mediator: mockMediator, suggsCtx })
})

describe.concurrent('ExecutorService suggestions', () => {
	test('Should be the initial suggestions length are zero', () => {
		expect(suggsCtx.data).length(0)
	})

	test('Should be every suggestions start with "help"', () => {
		executor.searchAutocomplete('help')

		vi.advanceTimersByTime(500)

		expect(suggsCtx.data.every(({ id }) => id.startsWith('help'))).toBe(true)
	})

	test('Should be first suggestions are help commands', () => {
		executor.searchAutocomplete('help :')

		vi.advanceTimersByTime(500)

		expect(suggsCtx.data.every(({ input }) => input.startsWith('help :'))).toBe(true)
	})

	test('Should be first suggestion are "help :help"', () => {
		executor.searchAutocomplete('help :help')

		vi.advanceTimersByTime(500)

		expect(suggsCtx.data).length(1)

		expect(suggsCtx.data[0].id).toBe('help-cmd-help')
	})

	test('Should be if search empty string suggestions length are zero', () => {
		executor.searchAutocomplete('help :help')

		vi.advanceTimersByTime(500)

		executor.searchAutocomplete('')

		vi.advanceTimersByTime(500)

		expect(suggsCtx.data).length(0)
	})
})
