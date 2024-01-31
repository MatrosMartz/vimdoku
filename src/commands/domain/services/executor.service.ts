import { inject } from '~/share/utils'

import type { IExec, IMed } from '../models'
import type { CmdListSvc } from './command.service'
import { SuggsObs } from './suggestions-obs.service'

interface ExecutorDeps {
	cmdList: CmdListSvc<unknown>
	mediator: IMed
}

/** Represent a Executor Service. */
export class ExecSvc implements IExec {
	readonly #cmdList
	readonly #mediator
	readonly #suggsObs = inject(SuggsObs)
	#timeoutID: ReturnType<typeof setTimeout> | null = null

	/**
	 * Creates an instance of the ExecSvc class.
	 * @param deps An object contains mediator service and other dependencies.
	 */
	constructor(deps: ExecutorDeps)
	constructor({ cmdList, mediator }: ExecutorDeps) {
		this.#cmdList = cmdList
		this.#mediator = mediator
	}

	run(cmdLike: string) {
		this.#cmdList.exec(cmdLike)

		return this
	}

	searchAutocomplete(cmdLike: string) {
		if (this.#timeoutID != null) clearTimeout(this.#timeoutID)

		this.#timeoutID = setTimeout(() => {
			this.#suggsObs.set(this.#cmdList.suggestions(cmdLike))
			this.#timeoutID = null
		}, 500)

		return this
	}
}
