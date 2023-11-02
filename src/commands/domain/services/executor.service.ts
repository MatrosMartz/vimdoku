import type { RemoveObserver } from '~/share/domain/models'
import { Observable } from '~/share/domain/services'
import { DialogKinds, PrefDialogTypes, ScreenActions } from '$screen/domain/models'
import { DifficultyKinds, SudokuActions } from '$sudoku/domain/models'

import type { Executor, IExecutor, IMediator, ISuggestion, Suggestion } from '../models'

interface ExecutorDeps {
	allSuggestions: ISuggestion[]
	mediator: IMediator
}

/** Represent a Executor Service. */
export class ExecutorService implements IExecutor {
	readonly #allSuggestions
	#history: string[] = []
	#mediator
	#observables = ExecutorService.#createObservables()
	#suggestions: Suggestion[] = []
	#timeoutID: ReturnType<typeof setTimeout> | null = null

	/**
	 * Creates an instance of the ExecutorService class.
	 * @param deps An object contains mediator service and other dependencies.
	 */
	constructor(deps: ExecutorDeps)
	constructor({ allSuggestions, mediator }: ExecutorDeps) {
		this.#mediator = mediator
		this.#allSuggestions = allSuggestions
	}

	/** Creates the observables for history and suggestions. */
	static #createObservables(): Executor.Observables {
		return { history: new Observable(), suggestions: new Observable() }
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
					kind: DialogKinds.Pref,
					opts: { type: PrefDialogTypes.diff },
				})
			if (args === 'all')
				this.#mediator.dispatch(ScreenActions.OpenDialog, {
					kind: DialogKinds.Pref,
					opts: { type: PrefDialogTypes.all },
				})
		}

		return this
	}

	get<K extends Executor.Keys>(key: K): Executor.State[K]
	get<K extends Executor.Keys>(key: K) {
		if (key === 'history') return this.#history
		if (key === 'suggestions') return this.#suggestions
	}

	searchAutocomplete(cmdLike: string) {
		if (this.#timeoutID != null) clearTimeout(this.#timeoutID)

		this.#timeoutID = setTimeout(() => {
			this.#suggestions = this.#allSuggestions.filter(suggestions => suggestions.match(cmdLike)).map(({ data }) => data)
			this.#update('suggestions')
			this.#timeoutID = null
		}, 500)

		return this
	}

	subscribe<K extends keyof Executor.State>(key: K, observer: Executor.Observers[K]): RemoveObserver {
		this.#observables[key].add(observer)
		observer(this.get(key))
		return () => this.#observables[key].remove(observer)
	}

	/**
	 * Updates the specified key in the observables with the current value from the state.
	 * @param key The key to update in the observables.
	 */
	#update<K extends Executor.Keys>(key: K) {
		this.#observables[key].update(this.get(key))
	}
}
