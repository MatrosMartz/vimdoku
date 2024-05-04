import { describe, expect, test } from 'vitest'

import { Cmd } from './command.entity'
import { SubCmd } from './subcommand.entity'

describe.concurrent('Subcommand', () => {
	test('Their value should be "help :set"', () => {
		const cmd = Cmd.fromString('h[elp]')
		const subCmd = SubCmd.fromString('<:>(set)', cmd)

		expect(subCmd.value).toBe('help :set')
	})

	test('Should return an object with the "match" key on true if matched, otherwise on false.', () => {
		const cmd = Cmd.fromString('h[elp]')
		const subCmd = SubCmd.fromString('<:>(set)', cmd)

		expect(subCmd.exec('help :set')).toEqual({ match: true, variables: {} })
		expect(subCmd.exec('help :set   ')).toEqual({ match: true, variables: {} })
		expect(subCmd.exec('   help :set')).toEqual({ match: true, variables: {} })
		expect(subCmd.exec('foo help :set')).toEqual({ match: false })
		expect(subCmd.exec('help :set foo')).toEqual({ match: false })
		expect(subCmd.exec('help')).toEqual({ match: false })
		expect(subCmd.exec('h ')).toEqual({ match: false })
	})

	test('Should return zero if it does not match or one greater if it does match.', () => {
		const cmd = Cmd.fromString('h[elp]')
		const subCmd = SubCmd.fromString('<:>(set)', cmd)

		expect(subCmd.getWeight('h')).toBe(1)
		expect(subCmd.getWeight('help')).toBe(4)
		expect(subCmd.getWeight('h ')).toBe(2)
		expect(subCmd.getWeight('help ')).toBe(5)
		expect(subCmd.getWeight('help 1')).toBe(0)
		expect(subCmd.getWeight('se')).toBe(2)
	})

	test('Should return zero if it does not match or one greater if it does match (Empty subcommand).', () => {
		const cmd = Cmd.fromString('h[elp]')
		const subCmd = SubCmd.fromString('', cmd)

		expect(subCmd.getWeight('h')).toBe(1)
		expect(subCmd.getWeight('help')).toBe(4)
		expect(subCmd.getWeight('h ')).toBe(0)
		expect(subCmd.getWeight('help foo')).toBe(0)
		expect(subCmd.getWeight('help 1')).toBe(0)
	})

	test('Should return an object with the prop key containing the input variables if it matches.', () => {
		const cmd = Cmd.fromString('se[t]')
		const subCmd = SubCmd.fromString('(history)<=>{|value|}', cmd)

		expect(subCmd.exec('se history=100')).toEqual({ match: true, variables: { value: '100' } })
		expect(subCmd.exec('set history=100')).toEqual({ match: true, variables: { value: '100' } })
		expect(subCmd.exec('set history=foo')).toEqual({ match: true, variables: { value: 'foo' } })
		expect(subCmd.exec('se history=')).toEqual({ match: false })
	})
})
