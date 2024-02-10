import { describe, expect, test } from 'vitest'

import { CmdTokenGroup } from './token.entity'

describe.concurrent('Cmd Group entity', () => {
	test('Their value should be "help"', () => {
		const cmd = CmdTokenGroup.fromString('h[elp]')

		expect(cmd.value).toBe('help')
	})

	test('Their execRgx should be "h(?:e(?:lp?)?)?\\s+"', () => {
		const cmd = CmdTokenGroup.fromString('h[elp]')

		expect(cmd.getExecRgx()).toBe('h(?:elp)?')
	})

	test('Their weight should be "h(?:e(?:lp?)?)?\\s+"', () => {
		const cmd = CmdTokenGroup.fromString('h[elp]')

		expect(cmd.getWeightRgx()).toBe('(h(?:e(?:lp?)?)?)?')
	})
})

describe.concurrent('Sub Group entity', () => {
	test('Their value should be "help :set"', () => {
		const cmd = CmdTokenGroup.fromString('h[elp]')
		const subCmd = cmd.createSub('<:>(set)')

		expect(subCmd.value).toBe('help :set')
	})

	test('Should return an object with the "match" key on true if matched, otherwise on false.', () => {
		const cmd = CmdTokenGroup.fromString('h[elp]')
		const subCmd = cmd.createSub('<:>(set)')

		expect(subCmd.exec('help :set')).toEqual({ match: true, variables: {} })
		expect(subCmd.exec('help :set   ')).toEqual({ match: true, variables: {} })
		expect(subCmd.exec('   help :set')).toEqual({ match: true, variables: {} })
		expect(subCmd.exec('foo help :set')).toEqual({ match: false })
		expect(subCmd.exec('help :set foo')).toEqual({ match: false })
		expect(subCmd.exec('help')).toEqual({ match: false })
		expect(subCmd.exec('h ')).toEqual({ match: false })
	})

	test('Should return zero if it does not match or one greater if it does match.', () => {
		const cmd = CmdTokenGroup.fromString('h[elp]')
		const subCmd = cmd.createSub('<:>(set)')

		expect(subCmd.getWeight('h')).toBe(1)
		expect(subCmd.getWeight('help')).toBe(4)
		expect(subCmd.getWeight('h ')).toBe(2)
		expect(subCmd.getWeight('help ')).toBe(5)
		expect(subCmd.getWeight('help 1')).toBe(0)
		expect(subCmd.getWeight('se')).toBe(2)
	})

	test('Should return zero if it does not match or one greater if it does match (Empty subcommand).', () => {
		const cmd = CmdTokenGroup.fromString('h[elp]')
		const subCmd = cmd.createSub('')

		expect(subCmd.getWeight('h')).toBe(1)
		expect(subCmd.getWeight('help')).toBe(4)
		expect(subCmd.getWeight('h ')).toBe(0)
		expect(subCmd.getWeight('help foo')).toBe(0)
		expect(subCmd.getWeight('help 1')).toBe(0)
	})

	test('Should return an object with the prop key containing the input variables if it matches.', () => {
		const cmd = CmdTokenGroup.fromString('se[t]')
		const subCmd = cmd.createSub('(history)<=>{|value|}')

		expect(subCmd.exec('se history=100')).toEqual({ match: true, variables: { value: '100' } })
		expect(subCmd.exec('set history=100')).toEqual({ match: true, variables: { value: '100' } })
		expect(subCmd.exec('set history=foo')).toEqual({ match: true, variables: { value: 'foo' } })
		expect(subCmd.exec('se history=')).toEqual({ match: false })
	})
})
