import { describe, expect, test, vi } from 'vitest'

import { noop } from '~/share/utils'

import { CmdTokenGroup, CmdTokenKind, SubTokenGroup, SubTokenKind } from '../entities'
import { type CreateHeader, SubCmdSvc } from './subcommand.service'

const createHeader: CreateHeader<{ cmd: string; sub: string }> = ([cmdTokens, subTokens]) => {
	const cmd = cmdTokens.tokens.map(({ value }) => value).join('')
	const sub = subTokens.tokens.map(({ value }) => value).join('')
	return { cmd, sub }
}

describe.concurrent('Subcommand Service', () => {
	test('The name should be the union of the tokens.', () => {
		const subCmd = new SubCmdSvc({
			createHeader: noop,
			desc: () => 'foobar',
			tokens: new SubTokenGroup({
				cmdTokenGroup: new CmdTokenGroup([
					{ kind: CmdTokenKind.REQUIRED, value: 'foo' },
					{ kind: CmdTokenKind.OPTIONAL, value: 'bar' },
				]),
				defaultVariables: {},
				tokens: [],
			}),
		})

		expect(subCmd.name).toBe('foobar')
	})

	test('The suggestion id should contain the tokens, their kind followed by their value.', () => {
		const subCmd = new SubCmdSvc({
			createHeader: noop,
			desc: () => 'foobar',
			tokens: new SubTokenGroup({
				cmdTokenGroup: new CmdTokenGroup([
					{ kind: CmdTokenKind.REQUIRED, value: 'foo' },
					{ kind: CmdTokenKind.OPTIONAL, value: 'bar' },
				]),
				defaultVariables: {},
				tokens: [],
			}),
		})

		expect(subCmd.getSuggestion('foo').id).toBe('{required.foo}-{optional.bar}')
	})

	test('The more the input matches, the greater the weight of the suggestion should be.', () => {
		const subCmd = new SubCmdSvc({
			createHeader: noop,
			desc: () => 'foobar',
			tokens: new SubTokenGroup({
				cmdTokenGroup: new CmdTokenGroup([
					{ kind: CmdTokenKind.REQUIRED, value: 'foo' },
					{ kind: CmdTokenKind.OPTIONAL, value: 'bar' },
				]),
				defaultVariables: {},
				tokens: [],
			}),
		})

		expect(subCmd.getSuggestion('foo').weight).toBe(3)
		expect(subCmd.getSuggestion('foobar').weight).toBe(6)
	})

	test('The "createHeader" function should work correctly.', () => {
		const subCmd = new SubCmdSvc({
			createHeader,
			desc: () => 'foobar',
			tokens: new SubTokenGroup({
				cmdTokenGroup: new CmdTokenGroup([
					{ kind: CmdTokenKind.REQUIRED, value: 'foo' },
					{ kind: CmdTokenKind.OPTIONAL, value: 'bar' },
				]),
				defaultVariables: {},
				tokens: [],
			}),
		})

		expect(subCmd.getSuggestion('foo').header).toEqual({ cmd: 'foobar', sub: '' })
	})

	test('Function should be called once if the input is correct.', () => {
		const fn = vi.fn(() => 'foo')
		const subCmd = new SubCmdSvc({
			createHeader: noop,
			desc: () => 'foobar',
			fn,
			tokens: new SubTokenGroup({
				cmdTokenGroup: new CmdTokenGroup([
					{ kind: CmdTokenKind.REQUIRED, value: 'foo' },
					{ kind: CmdTokenKind.OPTIONAL, value: 'bar' },
				]),
				defaultVariables: {},
				tokens: [],
			}),
		})

		subCmd.execIfMatch('foobar')
		expect(fn).toHaveBeenCalledOnce()
	})

	test('If the command includes variables, these will be passed to the function as parameters when executed if they match.', () => {
		const fn = vi.fn(() => 'foo')
		const subCmd = new SubCmdSvc({
			createHeader: noop,
			desc: () => 'foobar',
			fn,
			tokens: new SubTokenGroup({
				cmdTokenGroup: new CmdTokenGroup([
					{ kind: CmdTokenKind.REQUIRED, value: 'foo' },
					{ kind: CmdTokenKind.OPTIONAL, value: 'bar' },
				]),
				defaultVariables: { baz: 'baz' },
				tokens: [{ kind: SubTokenKind.VARIABLE, value: 'baz' }],
			}),
		})

		subCmd.execIfMatch('foobar')
		expect(fn).toHaveBeenCalledTimes(0)
		subCmd.execIfMatch('foobar qux')
		expect(fn).toHaveBeenCalledOnce()
		expect(fn).toBeCalledWith({ baz: 'qux' })
	})
})
