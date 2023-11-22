import type { IContext } from '~/share/domain/models'
import { DialogKinds, ScreenActions } from '$screen/domain/models'
import { DifficultyKinds, SudokuActions } from '$sudoku/domain/models'

import type { IExecutor, IMediator, ISuggestion, Suggestion } from '../models'
import { SuggestionService } from '.'

interface ExecutorDeps {
	allSuggestions: ISuggestion[]
	mediator: IMediator
	suggsCtx: IContext<Suggestion[]>
}

/** Represent a Executor Service. */
export class ExecutorService implements IExecutor {
	readonly #allSuggestions
	#mediator
	#suggsCtx
	#timeoutID: ReturnType<typeof setTimeout> | null = null

	/**
	 * Creates an instance of the ExecutorService class.
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
			this.#suggsCtx.push(SuggestionService.getData(newSuggs))
			this.#timeoutID = null
		}, 500)

		return this
	}
}
