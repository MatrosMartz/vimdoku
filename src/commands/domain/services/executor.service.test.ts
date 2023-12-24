import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import { inject } from '~/share/utils'
import { ALL_SUGGS } from '$cmd/infra/services'

import type { IMed, Med} from '../models'
import { ExecSvc } from './executor.service'
import { SuggsObs } from './suggestions-obs.service'

const mockMediator: IMed = {
	dispatch(action: Med.Actions, data?: Record<string, unknown>) {
		return this
	},
	async load() {},
}

const suggsObs = inject(SuggsObs)
let executor: ExecSvc

beforeAll(() => {
	vi.useFakeTimers()

	return () => vi.useRealTimers()
})

beforeEach(() => {
	executor = new ExecSvc({ allSuggestions: ALL_SUGGS, mediator: mockMediator })
})

describe.concurrent('ExecutorSvc suggestions', () => {
	test('Should be the initial suggestions length are zero', () => {
		expect(suggsObs.data).length(0)
	})

	test('Should be every suggestions start with "help"', () => {
		executor.searchAutocomplete('help')

		vi.advanceTimersByTime(500)

		expect(suggsObs.data.every(({ id }) => id.startsWith('help'))).toBe(true)
	})

	test('Should be first suggestions are help commands', () => {
		executor.searchAutocomplete('help :')

		vi.advanceTimersByTime(500)

		expect(suggsObs.data.every(({ input }) => input.startsWith('help :'))).toBe(true)
	})

	test('Should be first suggestion are "help :help"', () => {
		executor.searchAutocomplete('help :help')

		vi.advanceTimersByTime(500)

		expect(suggsObs.data).length(1)

		expect(suggsObs.data[0].id).toBe('help-cmd-help')
	})

	test('Should be if search empty string suggestions length are zero', () => {
		executor.searchAutocomplete('help :help')

		vi.advanceTimersByTime(500)

		executor.searchAutocomplete('')

		vi.advanceTimersByTime(500)

		expect(suggsObs.data).length(0)
	})
})
