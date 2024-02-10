import { type Desc, type DescFn, Sugg } from '../entities/suggestion.entity'
import { type CmdTokenGroup, type SubTokenGroup, type TokenList, type TokenVariables } from '../entities/token.entity'

export type CreateHeader<H> = (tokens: TokenList) => H

export interface SubCmdSvcOpts<S extends string, H> {
	fn?(variables: TokenVariables<S>): void
	createHeader: CreateHeader<H>
	desc: DescFn | Desc
	tokens: SubTokenGroup<S>
}

export type SubCmdFn = <H>(cmdTokensGroup: CmdTokenGroup, createHeader: CreateHeader<H>) => SubCmdSvc<H>

export class SubCmdSvc<T> {
	readonly #desc: Desc
	readonly #fn
	readonly #header
	readonly #id
	readonly #tokens

	constructor({ desc, tokens, fn, createHeader }: SubCmdSvcOpts<string, T>) {
		this.#desc = Array.isArray(desc) ? desc : [desc]
		this.#tokens = tokens
		this.#fn = fn
		this.#header = createHeader(this.#tokens.tokens)
		this.#id = tokens.tokens.flatMap(({ tokens }) => tokens.map(({ kind, value }) => `{${kind}.${value}}`)).join('-')
	}

	get name() {
		return this.#tokens.value
	}

	static create<const S extends string>(
		subLike: S,
		opts: Omit<SubCmdSvcOpts<S, unknown>, 'createHeader' | 'tokens'>
	): SubCmdFn {
		return (cmdTokenGroup, createHeader) =>
			new SubCmdSvc({ ...opts, tokens: cmdTokenGroup.createSub(subLike), createHeader })
	}

	execIfMatch(input: string) {
		if (this.#fn == null) return

		const result = this.#tokens.exec(input)

		if (!result.match) return
		this.#fn(result.variables)
	}

	getSuggestion(input: string) {
		return new Sugg({
			desc: this.#desc,
			value: this.#tokens.value,
			weight: this.#tokens.getWeight(input),
			header: this.#header,
			id: this.#id,
		})
	}
}
