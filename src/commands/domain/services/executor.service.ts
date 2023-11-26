import type { IContext } from '~/share/domain/models'
import { DialogKinds, ScreenActions } from '$screen/domain/models'
import { DifficultyKinds, SudokuActions } from '$sudoku/domain/models'

import type { IExecutor, IMediator, ISugg, Sugg } from '../models'
import { SuggSvc } from '.'

interface ExecutorDeps {
	allSuggestions: ISugg[]
	mediator: IMediator
	suggsCtx: IContext<Sugg[]>
}

/** Represent a Executor Service. */
export class ExecutorSvc implements IExecutor {
	readonly #allSuggestions
	readonly #mediator
	readonly #suggsCtx
	#timeoutID: ReturnType<typeof setTimeout> | null = null

	/**
	 * Creates an instance of the ExecutorSvc class.
	 * @param deps An object contains mediator service and other dependencies.
	 */
	constructor(deps: ExecutorDeps)
	constructor({ allSuggestions, mediator, suggsCtx: state }: ExecutorDeps) {
		this.#mediator = mediator
		this.#allSuggestions = allSuggestions
		this.#suggsCtx = state
	}

	exec(cmdLike: string) {
		const [command = '', args = ''] = cmdLike.split(/(?<=^[^\s\t]+)((?:\s|\t).*)/).map(r => r?.trim())

		if (/^(q(?:uit)|x(?:it)?|exit?)?$/.test(command)) {
			this.#mediator.dispatch(ScreenActions.Exit)
		}
		if (/^st(?:art)?$/.test(command) && Object.values(DifficultyKinds).includes(args)) {
			this.#mediator.dispatch(SudokuActions.Start, { difficulty: args })
		}
		if (/^w(?:rite)?$/.test(command)) {
			this.#mediator.dispatch(SudokuActions.Save)
		}
		if (/^wq(?:uit)?$/.test(command)) {
			this.#mediator.dispatch(ScreenActions.Exit).dispatch(SudokuActions.Save)
		}

		if (/^set?$/.test(command)) {
			if (args.length === 0)
				this.#mediator.dispatch(ScreenActions.OpenDialog, {
					kind: DialogKinds.PrefDiff,
				})
			if (args === 'all')
				this.#mediator.dispatch(ScreenActions.OpenDialog, {
					kind: DialogKinds.PrefAll,
				})
		}

		return this
	}

	searchAutocomplete(cmdLike: string) {
		if (this.#timeoutID != null) clearTimeout(this.#timeoutID)

		this.#timeoutID = setTimeout(() => {
			const newSuggs = this.#allSuggestions.filter(suggs => suggs.match(cmdLike))
			this.#suggsCtx.push(SuggSvc.getData(newSuggs))
			this.#timeoutID = null
		}, 500)

		return this
	}
}
