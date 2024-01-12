import { inject } from '~/share/utils'
import { DialogKind, ScreenAction } from '$screen/domain/models'
import { DifficultyKind, SudokuAction } from '$sudoku/domain/models'

import type { Sugg } from '../entities'
import type { IExec, IMed } from '../models'
import { SuggsObs } from './suggestions-obs.service'

interface ExecutorDeps {
	allSuggestions: Sugg[]
	mediator: IMed
}

/** Represent a Executor Service. */
export class ExecSvc implements IExec {
	readonly #allSuggestions
	readonly #mediator
	readonly #suggsObs = inject(SuggsObs)
	#timeoutID: ReturnType<typeof setTimeout> | null = null

	/**
	 * Creates an instance of the ExecSvc class.
	 * @param deps An object contains mediator service and other dependencies.
	 */
	constructor(deps: ExecutorDeps)
	constructor({ allSuggestions, mediator }: ExecutorDeps) {
		this.#mediator = mediator
		this.#allSuggestions = allSuggestions
	}

	run(cmdLike: string) {
		const [command = '', args = ''] = cmdLike.split(/(?<=^[^\s\t]+)((?:\s|\t).*)/).map(r => r?.trim())

		if (/^(q(?:uit)|x(?:it)?|exit?)?$/.test(command)) {
			this.#mediator.dispatch(ScreenAction.Exit)
		}
		if (/^st(?:art)?$/.test(command) && Object.values(DifficultyKind).includes(args)) {
			this.#mediator.dispatch(SudokuAction.Start, { difficulty: args })
		}
		if (/^w(?:rite)?$/.test(command)) {
			this.#mediator.dispatch(SudokuAction.Save)
		}
		if (/^wq(?:uit)?$/.test(command)) {
			this.#mediator.dispatch(ScreenAction.Exit).dispatch(SudokuAction.Save)
		}

		if (/^set?$/.test(command)) {
			if (args.length === 0)
				this.#mediator.dispatch(ScreenAction.OpenDialog, {
					kind: DialogKind.PrefDiff,
				})
			if (args === 'all')
				this.#mediator.dispatch(ScreenAction.OpenDialog, {
					kind: DialogKind.PrefAll,
				})
		}

		return this
	}

	searchAutocomplete(cmdLike: string) {
		if (this.#timeoutID != null) clearTimeout(this.#timeoutID)

		this.#timeoutID = setTimeout(() => {
			const newSuggs = this.#allSuggestions.filter(suggs => suggs.match(cmdLike))
			this.#suggsObs.set(newSuggs)
			this.#timeoutID = null
		}, 500)

		return this
	}
}
