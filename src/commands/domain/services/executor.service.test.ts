import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import { cmdListMock } from '~/__mocks__/command.service'
import { inject } from '~/share/utils'

import { ExecSvc } from './executor.service'
import { SuggsObs } from './suggestions-obs.service'

const suggsObs = inject(SuggsObs)
let executor: ExecSvc

beforeAll(() => {
	vi.useFakeTimers()

	return () => vi.useRealTimers()
})

beforeEach(() => {
	executor = new ExecSvc({ cmdList: cmdListMock })
})

describe.concurrent('ExecutorSvc suggestions', () => {
	test('Should be the initial suggestions length are zero', () => {
		expect(suggsObs.data).length(0)
	})

	test('Should be every suggestions start with "help"', () => {
		executor.searchAutocomplete('help')

		vi.advanceTimersByTime(500)

		const isHelp = ({ value }: { value: string }) => value.startsWith('help')

		expect(suggsObs.data).toSatisfyAll(isHelp)
	})

	test('Should be if search empty string suggestions length are zero', () => {
		executor.searchAutocomplete('help :help')

		vi.advanceTimersByTime(500)

		executor.searchAutocomplete('')

		vi.advanceTimersByTime(500)

		expect(suggsObs.data).length(0)
	})
})
