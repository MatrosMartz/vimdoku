import { describe, expect, test } from 'vitest'

import { Cmd } from './command.entity'

describe.concurrent('Cmd Group entity', () => {
	test('Their value should be "help"', () => {
		const cmd = Cmd.fromString('h[elp]')

		expect(cmd.value).toBe('help')
	})

	test('Their execRgx should be "h(?:e(?:lp?)?)?\\s+"', () => {
		const cmd = Cmd.fromString('h[elp]')

		expect(cmd.getExecRgx()).toBe('h(?:elp)?')
	})

	test('Their weight should be "h(?:e(?:lp?)?)?\\s+"', () => {
		const cmd = Cmd.fromString('h[elp]')

		expect(cmd.getWeightRgx()).toBe('(h(?:e(?:lp?)?)?)?')
	})
})
