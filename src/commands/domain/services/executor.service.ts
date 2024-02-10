import { inject } from '~/share/utils'

import type { IExec } from '../models'
import type { CmdListSvc } from './command.service'
import { SuggsObs } from './suggestions-obs.service'

interface ExecutorDeps {
	cmdList: CmdListSvc<unknown>
}

/** Represent a Executor Service. */
export class ExecSvc implements IExec {
	readonly #cmdList
	readonly #suggsObs = inject(SuggsObs)
	#timeoutID: ReturnType<typeof setTimeout> | null = null

	/**
	 * Creates an instance of the ExecSvc class.
	 * @param deps An object contains command list service and other dependencies.
	 */
	constructor(deps: ExecutorDeps)
	constructor({ cmdList }: ExecutorDeps) {
		this.#cmdList = cmdList
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
