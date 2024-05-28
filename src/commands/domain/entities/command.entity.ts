import { A, Match } from '~/share/utils'

import * as CmdToken from './command-token.entity'

/**
 * Create pattern for optional cmd Tokens.
 * @param str The value of token.
 * @returns The optional pattern.
 */
export function optionally(str: string) {
	return str.length > 0 ? str.split(/(?<!\\)/).reduceRight((acc, curr) => `(?:${curr}${acc}?)`) + '?' : ''
}

/** Represent a Command Token Group. */
export class Cmd {
	#execRgx?: string
	#value?: string
	#weightRgx?: string

	static readonly #createCmdToken = new Match.Builder<readonly [tokenStr: string], CmdToken.CmdToken>()
		.addCase(A.is.Array.with(0, A.match(/^\[[^[\]]*\]$/i)), t => new CmdToken.Optional(t.slice(1, -1)))
		.default(t => new CmdToken.Required(t))
		.done()

	readonly #tokens

	constructor(tokens: readonly CmdToken.CmdToken[]) {
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
		return new Cmd(str.split(/(?<=])|(?=\[)/).map(Cmd.#createCmdToken))
	}

	// /**
	//  * Create new instance of SubTokenGroup using this CmdTokenGroup instance.
	//  * @param str The subcommand string representation.
	//  * @returns A new SubTokenGroup instance.
	//  */
	// createSub<const S extends string>(str: S) {
	// 	return SubTokenGroup.fromString(str, this)
	// }

	/**
	 * Gets the exec command pattern.
	 * @returns The exec pattern command only.
	 */
	getExecRgx() {
		this.#execRgx ??= this.#tokens
			.map(({ kind, value }) => {
				if (kind === CmdToken.Kind.REQUIRED) return value.toLowerCase()
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
				if (kind === CmdToken.Kind.REQUIRED) return value.toLowerCase()
				return optionally(value.toLowerCase())
			})
			.join('')

		return '(' + this.#weightRgx + ')?'
	}
}
