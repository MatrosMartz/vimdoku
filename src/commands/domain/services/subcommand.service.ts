import { type Cmd, type Desc, type DescFn, SubCmd, Sugg, type TokenList, type TokenVariables } from '../entities'
export type CreateHeader<H> = (tokenList: TokenList) => H

export interface SubCmdSvcOpts<S extends string, H> {
	fn?(variables: TokenVariables<S>): void
	createHeader: CreateHeader<H>
	desc: DescFn | Desc
	subCmd: SubCmd<S>
}

export type SubCmdFn = <H>(cmdTokensGroup: Cmd, createHeader: CreateHeader<H>) => SubCmdSvc<H>

export class SubCmdSvc<T> {
	readonly #desc: Desc
	readonly #fn
	readonly #header
	readonly #id
	readonly #subCmd

	constructor({ desc, subCmd, fn, createHeader }: SubCmdSvcOpts<string, T>) {
		this.#desc = Array.isArray(desc) ? desc : [desc]
		this.#subCmd = subCmd
		this.#fn = fn
		this.#header = createHeader(subCmd.tokenList)
		this.#id = subCmd.tokenList.flatMap(tokens => tokens.map(({ kind, value }) => `{${kind}.${value}}`)).join('-')
	}

	get name() {
		return this.#subCmd.value
	}

	static buildFn<const S extends string>(
		subLike: S,
		opts: Omit<SubCmdSvcOpts<S, unknown>, 'createHeader' | 'subCmd'>
	): SubCmdFn {
		return (cmd, createHeader) => new SubCmdSvc({ ...opts, subCmd: SubCmd.fromString(subLike, cmd), createHeader })
	}

	execIfMatch(input: string) {
		if (this.#fn == null) return

		const result = this.#subCmd.exec(input)

		if (!result.match) return
		this.#fn(result.variables)
	}

	getSuggestion(input: string) {
		return new Sugg({
			desc: this.#desc,
			value: this.#subCmd.value,
			weight: this.#subCmd.getWeight(input),
			header: this.#header,
			id: this.#id,
		})
	}
}
