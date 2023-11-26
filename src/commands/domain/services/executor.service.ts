import type { IObs } from '~/share/domain/models'
import { DialogKinds, ScreenActions } from '$screen/domain/models'
import { DifficultyKinds, SudokuActions } from '$sudoku/domain/models'

import type { IExec, IMed, ISugg, Sugg } from '../models'
import { SuggSvc } from '.'

interface ExecutorDeps {
	allSuggestions: ISugg[]
	mediator: IMed
	suggsObs: IObs<Sugg[]>
}

/** Represent a Executor Service. */
export class ExecSvc implements IExec {
	readonly #allSuggestions
	readonly #mediator
	readonly #suggsObs
	#timeoutID: ReturnType<typeof setTimeout> | null = null

	/**
	 * Creates an instance of the ExecSvc class.
	 * @param deps An object contains mediator service and other dependencies.
	 */
	constructor(deps: ExecutorDeps)
	constructor({ allSuggestions, mediator, suggsObs }: ExecutorDeps) {
		this.#mediator = mediator
		this.#allSuggestions = allSuggestions
		this.#suggsObs = suggsObs
	}

	run(cmdLike: string) {
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
			this.#suggsObs.update(SuggSvc.getArrayData(newSuggs))
			this.#timeoutID = null
		}, 500)

		return this
	}
}
