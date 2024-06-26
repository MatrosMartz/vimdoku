import { Cmd, type Desc, type DescFn } from '../entities'
import { type CreateHeader, type SubCmdFn, SubCmdSvc } from './subcommand.service'

export interface CmdBuilderOpts {
	fn?(): void
	cmdLike: string
	desc: DescFn | Desc
}

export type CmdFn = <H>(createHeader: CreateHeader<H>) => Array<SubCmdSvc<H>>

class CmdBuilder {
	readonly #cmdTokenList
	#subCmdFnList: SubCmdFn[]

	constructor(opts: CmdBuilderOpts)
	constructor({ desc, fn, cmdLike }: CmdBuilderOpts) {
		this.#cmdTokenList = Cmd.fromString(cmdLike)
		this.#subCmdFnList = [SubCmdSvc.buildFn('', { desc, fn })]
	}

	addSubFn(...subCmdFn: SubCmdFn[]) {
		this.#subCmdFnList = [...this.#subCmdFnList, ...subCmdFn]
		return this
	}

	done(): CmdFn {
		return createHeader => this.#subCmdFnList.map(fn => fn(this.#cmdTokenList, createHeader))
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

	static buildCmdFn(cmdLike: string, opts: Omit<CmdBuilderOpts, 'cmdLike'>) {
		return new CmdBuilder({ ...opts, cmdLike })
	}
}

class ShellBuilder<H> {
	#cmdFnList: Array<CmdSvc<H>> = []
	readonly #createHeader

	constructor(createHeader: CreateHeader<H>) {
		this.#createHeader = createHeader
	}

	addCmdFn(...cmdFn: CmdFn[]) {
		this.#cmdFnList = [...this.#cmdFnList, ...cmdFn.map(fn => new CmdSvc(fn(this.#createHeader)))]
		return this
	}

	done() {
		return new ShellSvc(this.#cmdFnList)
	}
}

export class ShellSvc<H> {
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

	static buildFn<H>(createHeader: CreateHeader<H>) {
		return new ShellBuilder(createHeader)
	}

	exec(input: string) {
		for (const subCmd of this.subCmds) subCmd.execIfMatch(input)
	}

	suggestions(input: string) {
		const suggs = this.subCmds
			.map(subCmd => subCmd.getSuggestion(input))
			.filter(sugg => sugg.weight > 0)
			.sort((a, b) => b.weight - a.weight)

		return suggs.filter(sugg => sugg.weight > suggs[0].weight - 1)
	}
}
