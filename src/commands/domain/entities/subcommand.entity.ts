import type { VariablesFromStr } from '~/share/types'
import { A, Match } from '~/share/utils'

import { type Cmd, optionally } from './command.entity'
import type * as CmdToken from './command-token.entity'
import * as SubCmdToken from './subcommand-token.entity'

export type TokenVariables<S extends string> = Record<VariablesFromStr<S>, string>

export type SubCmdMatchResult<S extends string> = { match: false } | { match: true; variables: TokenVariables<S> }

interface SubTokenOpts<S extends string = string> {
	cmd: Cmd
	defaultVariables: TokenVariables<S>
	tokens: readonly SubCmdToken.SubCmdToken[]
}

export type TokenList = readonly [readonly CmdToken.CmdToken[], readonly SubCmdToken.SubCmdToken[]]

/** Represent a Subcommand Token Group. */
export class SubCmd<S extends string = string> {
	#execRgx?: string
	#weightPattern?: string

	static readonly #createSubCmdToken = new Match.Builder<readonly [tokenStr: string], SubCmdToken.SubCmdToken>()
		.addCase(A.is.Array.with(0, A.match(/^\{\|[^{}|]+\|\}$/i)), t => new SubCmdToken.Variable(t.slice(2, -2)))
		.addCase(A.is.Array.with(0, A.match(/^{[^{}]+}$/i)), t => new SubCmdToken.Holder(t.slice(1, -1)))
		.addCase(A.is.Array.with(0, A.match(/^<[^<>]+>$/i)), t => new SubCmdToken.Symbol(t.slice(1, -1)))
		.addCase(A.is.Array.with(0, A.match(/^\([^()]+\)$$/i)), t => new SubCmdToken.Value(t.slice(1, -1)))
		.addCase(A.is.Array.with(0, A.match(/[<>(){}]/i)), () => {
			throw new Error('tokenListLike are invalid')
		})
		.default(t => new SubCmdToken.Normal(t))
		.done()

	readonly #cmd
	readonly #defaultVariables
	readonly #tokens

	constructor({ cmd, defaultVariables, tokens }: SubTokenOpts<S>) {
		this.#cmd = cmd
		this.#tokens = tokens
		this.#defaultVariables = defaultVariables
	}

	get tokenList(): TokenList {
		return [this.#cmd.tokens, this.#tokens]
	}

	get value() {
		if (this.#tokens.length <= 0) return this.#cmd.value

		const value = this.#tokens
			.filter(t => t.kind !== SubCmdToken.Kind.HOLDER)
			.map(t => t.value)
			.join('')

		return `${this.#cmd.value} ${value}`
	}

	/**
	 * Create a new SubTokenGroup instance from string.
	 * @param str The subcommand string like.
	 * @param cmd The command tokens.
	 * @returns A new SubTokenGroup instance.
	 */
	static fromString<const S extends string>(str: S, cmd: Cmd) {
		const tokens = str.length > 0 ? str.split(/(?<=[>)}])|(?=[<({])/).map(SubCmd.#createSubCmdToken) : []

		const defaultProps = Object.fromEntries(
			tokens.filter(p => p.kind === SubCmdToken.Kind.VARIABLE).map(({ value }) => [value, ''])
		) as TokenVariables<S>

		return new SubCmd({ tokens, defaultVariables: defaultProps, cmd })
	}

	/**
	 * Gets the input variables if matched.
	 * @param input The string to checked.
	 * @returns An object with match property and variables property if as matched.
	 */
	exec(input: string): SubCmdMatchResult<S> {
		this.#execRgx ??= '^' + this.#cmd.getExecRgx() + this.#getExecRgx() + '$'
		const ExecArray = new RegExp(this.#execRgx).exec(input.trim().toLowerCase())

		if (ExecArray == null) return { match: false }
		return {
			match: true,
			variables: { ...this.#defaultVariables, ...ExecArray.groups },
		}
	}

	/**
	 * Get the weight compared with a string.
	 * @param input The string with compared.
	 * @returns The weight.
	 */
	getWeight(input: string) {
		this.#weightPattern = this.#cmd.getWeightRgx() + this.#getWeightRgx() + '$'
		return new RegExp(this.#weightPattern).exec(input)?.[0].length ?? 0
	}

	/**
	 * Gets the exec subcommand pattern.
	 * @returns The exec pattern subcommand only.
	 */
	#getExecRgx() {
		if (this.#tokens.length <= 0) return ''

		return (
			'\\s+' +
			this.#tokens
				.map(({ kind, value }) => {
					if (kind === SubCmdToken.Kind.VARIABLE) return `(?<${value.toLowerCase()}>\\w+)`
					if (kind === SubCmdToken.Kind.SYMBOL) return value.toLowerCase().replace(/[?!:=\\^<>&*+]/g, m => '\\' + m)
					return value.toLowerCase()
				})
				.join('')
		)
	}

	/**
	 * Gets the weight subcommand pattern.
	 * @returns The weight pattern subcommand only.
	 */
	#getWeightRgx() {
		if (this.#tokens.length <= 0) return ''

		const a = this.#tokens
			.map(({ kind, value }) => {
				if ([SubCmdToken.Kind.HOLDER, SubCmdToken.Kind.VARIABLE].includes(kind)) return '([^\\w?!:=\\\\^<>&*+])?'
				if (kind === SubCmdToken.Kind.SYMBOL) {
					const newValue = value.toLowerCase().replace(/[?!:=\\^<>&*+]/g, m => '\\' + m)
					return `(${newValue[0]}${optionally(newValue.slice(1))})?`
				}
				const newValue = value.toLowerCase()
				return `(${newValue[0]}${optionally(newValue.slice(1))})?`
			})
			.join('')

		return '(\\s)?' + a
	}
}
