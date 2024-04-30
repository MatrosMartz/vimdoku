import type { VariablesFromStr } from '~/share/types'
import { BuildMatcher, Case } from '~/share/utils'

export enum TokenGroupKind {
	COMMAND = 'command',
	SUB_CMD = 'subcommand',
}

export enum CmdTokenKind {
	OPTIONAL = 'optional',
	REQUIRED = 'required',
}

export enum SubTokenKind {
	HOLDER = 'holder',
	SYMBOL = 'symbol',
	VALUE = 'value',
	VARIABLE = 'variable',
	NORMAL = 'normal',
}

export interface CmdToken {
	kind: CmdTokenKind
	value: string
}

export interface SubToken {
	kind: SubTokenKind
	value: string
}

export type CmdTokenTuple = [
	{ kind: CmdTokenKind.REQUIRED; value: string },
	{ kind: CmdTokenKind.OPTIONAL; value: string },
]

/**
 * Create pattern for optional cmd Tokens.
 * @param str The value of token.
 * @returns The optional pattern.
 */
function optionally(str: string) {
	return str.length > 0 ? str.split(/(?<!\\)/).reduceRight((acc, curr) => `(?:${curr}${acc}?)`) + '?' : ''
}

/** Represent a Command Token Group. */
export class CmdTokenGroup {
	#execRgx?: string
	#value?: string
	#weightRgx?: string
	readonly #tokens

	constructor(tokens: CmdTokenTuple) {
		this.#tokens = tokens
	}

	get tokens() {
		return this.#tokens
	}

	get value() {
		this.#value ??= this.#tokens.map(t => t.value).join('')

		return this.#value
	}

	/**
	 * Create a new CmdToken instance from string.
	 * @param str The command string like.
	 * @returns A new CmdTokenGroup instance.
	 */
	static fromString(str: string) {
		const [req, opt] = str.split(/\[|\]/)

		if (req == null || opt == null) throw new Error(`The "${str}" string are invalid.`)

		return new CmdTokenGroup([
			{ kind: CmdTokenKind.REQUIRED, value: req },
			{ kind: CmdTokenKind.OPTIONAL, value: opt },
		])
	}

	/**
	 * Create new instance of SubTokenGroup using this CmdTokenGroup instance.
	 * @param str The subcommand string representation.
	 * @returns A new SubTokenGroup instance.
	 */
	createSub<const S extends string>(str: S) {
		return SubTokenGroup.fromString(str, this)
	}

	/**
	 * Gets the exec command pattern.
	 * @returns The exec pattern command only.
	 */
	getExecRgx() {
		this.#execRgx ??= this.#tokens
			.map(({ kind, value }) => {
				if (kind === CmdTokenKind.REQUIRED) return value.toLowerCase()
				return `(?:${value.toLowerCase()})?`
			})
			.join('')

		return this.#execRgx
	}

	/**
	 * Gets the weight command pattern.
	 * @returns The weight pattern command only.
	 */
	getWeightRgx() {
		this.#weightRgx ??= this.#tokens
			.map(({ kind, value }) => {
				if (kind === CmdTokenKind.REQUIRED) return value.toLowerCase()
				return optionally(value.toLowerCase())
			})
			.join('')

		return '(' + this.#weightRgx + ')?'
	}
}

export type TokenVariables<S extends string> = Record<VariablesFromStr<S>, string>

export type MatchResult<S extends string> = { match: false } | { match: true; variables: TokenVariables<S> }

interface SubTokenGroupOpts<S extends string = string> {
	cmdTokenGroup: CmdTokenGroup
	defaultVariables: TokenVariables<S>
	tokens: SubToken[]
}

export type TokenList = [
	{ group: TokenGroupKind.COMMAND; tokens: CmdTokenTuple },
	{ group: TokenGroupKind.SUB_CMD; tokens: SubToken[] },
]

/** Represent a Subcommand Token Group. */
export class SubTokenGroup<S extends string = string> {
	#execRgx?: string
	#weightPattern?: string

	static readonly #createSubToken = new BuildMatcher<readonly [string], SubToken>()
		.addCase([Case.fromRegex(/^\{\|[^{}|]+\|\}$/i)], t => ({ kind: SubTokenKind.VARIABLE, value: t.slice(2, -2) }))
		.addCase([Case.fromRegex(/^{[^{}]+}$/i)], t => ({ kind: SubTokenKind.HOLDER, value: t.slice(1, -1) }))
		.addCase([Case.fromRegex(/^<[^<>]+>$/i)], t => ({ kind: SubTokenKind.SYMBOL, value: t.slice(1, -1) }))
		.addCase([Case.fromRegex(/^\([^()]+\)$$/i)], t => ({ kind: SubTokenKind.VALUE, value: t.slice(1, -1) }))
		.addCase([Case.fromRegex(/[<>(){}]/i)], () => {
			throw new Error('tokenListLike are invalid')
		})
		.default(t => ({ kind: SubTokenKind.NORMAL, value: t }))
		.done()

	readonly #cmdTokenGroup
	readonly #defaultVariables
	readonly #tokens

	constructor({ cmdTokenGroup, defaultVariables, tokens }: SubTokenGroupOpts<S>) {
		this.#cmdTokenGroup = cmdTokenGroup
		this.#tokens = tokens
		this.#defaultVariables = defaultVariables
	}

	get tokens(): TokenList {
		return [
			{ group: TokenGroupKind.COMMAND, tokens: this.#cmdTokenGroup.tokens },
			{ group: TokenGroupKind.SUB_CMD, tokens: this.#tokens },
		]
	}

	get value() {
		if (this.#tokens.length <= 0) return this.#cmdTokenGroup.value

		const value = this.#tokens
			.filter(t => t.kind !== SubTokenKind.HOLDER)
			.map(t => t.value)
			.join('')

		return `${this.#cmdTokenGroup.value} ${value}`
	}

	/**
	 * Create a new SubTokenGroup instance from string.
	 * @param str The subcommand string like.
	 * @param cmdTokenGroup The command tokens.
	 * @returns A new SubTokenGroup instance.
	 */
	static fromString<const S extends string>(str: S, cmdTokenGroup: CmdTokenGroup) {
		const tokens = str.length > 0 ? str.split(/(?<=[>)}])|(?=[<({])/).map(SubTokenGroup.#createSubToken) : []

		const defaultProps = Object.fromEntries(
			tokens.filter(p => p.kind === SubTokenKind.VARIABLE).map(({ value }) => [value, ''])
		) as TokenVariables<S>

		return new SubTokenGroup({ tokens, defaultVariables: defaultProps, cmdTokenGroup })
	}

	/**
	 * Gets the input variables if matched.
	 * @param input The string to checked.
	 * @returns An object with match property and variables property if as matched.
	 */
	exec(input: string): MatchResult<S> {
		this.#execRgx ??= '^' + this.#cmdTokenGroup.getExecRgx() + this.#getExecRgx() + '$'
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
		this.#weightPattern = this.#cmdTokenGroup.getWeightRgx() + this.#getWeightRgx() + '$'

		/* const [fullMatch, ...matches] = new RegExp(this.#weightPattern).exec(input)?.filter(m => m != null) ?? ['']

		if (fullMatch.length > 0) console.log({ pattern: this.value, fullMatch, matches })
		return {
			weight: fullMatch.length,
			matches: matches.reduce((acc, curr) => acc + curr.length, 0),
		} */
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
					if (kind === SubTokenKind.VARIABLE) return `(?<${value.toLowerCase()}>\\w+)`
					if (kind === SubTokenKind.SYMBOL) return value.toLowerCase().replace(/[?!:=\\^<>&*+]/g, m => '\\' + m)
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
				if ([SubTokenKind.HOLDER, SubTokenKind.VARIABLE].includes(kind)) return '([^\\w?!:=\\\\^<>&*+])?'
				if (kind === SubTokenKind.SYMBOL) {
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
