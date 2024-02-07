import { CmdTokenGroup, type Desc } from '../entities'
import { type CreateHeader, type SubCmdFn, SubCmdSvc } from './subcommand.service'

export interface CmdBuilderOpts {
	fn?(): void
	cmdLike: string
	desc: (() => string) | Desc
}

export type CmdFn = <H>(createHeader: CreateHeader<H>) => Array<SubCmdSvc<H>>

class CmdBuilder {
	readonly #cmdTokenList
	#subCmdFnList: SubCmdFn[]

	constructor(opts: CmdBuilderOpts)
	constructor({ desc, fn, cmdLike }: CmdBuilderOpts) {
		this.#cmdTokenList = CmdTokenGroup.fromString(cmdLike)
		this.#subCmdFnList = [SubCmdSvc.create('', { desc, fn })]
	}

	done(): CmdFn {
		return createHeader => this.#subCmdFnList.map(fn => fn(this.#cmdTokenList, createHeader))
	}

	sub(subCmdFn: SubCmdFn) {
		this.#subCmdFnList = this.#subCmdFnList.concat(subCmdFn)
		return this
	}

	subFromArray<T>(array: T[], fn: (value: T) => SubCmdFn) {
		this.#subCmdFnList = this.#subCmdFnList.concat(...array.map(fn))
		return this
	}
}

export class CmdSvc<H> {
	readonly #subCmds

	constructor(subcommands: Array<SubCmdSvc<H>>) {
		this.#subCmds = subcommands
	}

	get name() {
		return this.#subCmds[0].name
	}

	get subCmds() {
		return this.#subCmds
	}

	static create(cmdLike: string, opts: Omit<CmdBuilderOpts, 'cmdLike'>) {
		return new CmdBuilder({ ...opts, cmdLike })
	}
}

class CmdListBuilder<H> {
	#cmdFnList: Array<CmdSvc<H>> = []
	readonly #createHeader

	constructor(createHeader: CreateHeader<H>) {
		this.#createHeader = createHeader
	}

	cmd(CmdFn: CmdFn) {
		this.#cmdFnList = this.#cmdFnList.concat(new CmdSvc(CmdFn(this.#createHeader)))
		return this
	}

	done() {
		return new CmdListSvc(this.#cmdFnList)
	}
}

export class CmdListSvc<H> {
	readonly #list

	constructor(initialList: Array<CmdSvc<H>>) {
		this.#list = initialList
	}

	get cmds() {
		return this.#list.map(cmd => cmd.name)
	}

	get subCmds() {
		return this.#list.flatMap(cmd => cmd.subCmds)
	}

	static create<H>(createHeader: CreateHeader<H>) {
		return new CmdListBuilder(createHeader)
	}

	exec(input: string) {
		for (const subCmd of this.subCmds) subCmd.execIfMatch(input)
	}

	suggestions(input: string) {
		return this.subCmds
			.map(subCmd => subCmd.getSuggestion(input))
			.filter(sugg => sugg.weight > 0)
			.sort((a, b) => b.weight - a.weight)
	}
}
