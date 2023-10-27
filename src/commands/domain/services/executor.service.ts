import type { RemoveObserver } from '~/share/domain/models'
import { Observable } from '~/share/domain/services'
import { DialogKinds, PrefDialogTypes, ScreenActions } from '$screen/domain/models'
import { DifficultyKinds, SudokuActions } from '$sudoku/domain/models'

import type {
	ExecutorKeys,
	ExecutorObservables,
	ExecutorObservers,
	ExecutorState,
	IExecutor,
	IMediator,
	Suggestion,
} from '../models'
import { ALL_SUGGESTIONS } from './suggestions.service'

interface ExecutorDeps {
	mediator: IMediator
}

/** Represent a Executor Service. */
export class ExecutorService implements IExecutor {
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
	constructor({ mediator }: ExecutorDeps) {
		this.#mediator = mediator
	}

	/** Creates the observables for history and suggestions. */
	static #createObservables(): ExecutorObservables {
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
		}

		return this
	}

	get<K extends ExecutorKeys>(key: K): ExecutorState[K]
	get<K extends ExecutorKeys>(key: K) {
		if (key === 'history') return this.#history
		if (key === 'suggestions') return this.#suggestions
	}

	searchAutocomplete(cmdLike: string) {
		if (this.#timeoutID != null) clearTimeout(this.#timeoutID)

		this.#timeoutID = setTimeout(() => {
			this.#suggestions = ALL_SUGGESTIONS.filter(suggestions => suggestions.match(cmdLike)).map(({ data }) => data)
			this.#update('suggestions')
			this.#timeoutID = null
		}, 500)

		return this
	}

	subscribe<K extends keyof ExecutorState>(key: K, observer: ExecutorObservers[K]): RemoveObserver {
		this.#observables[key].add(observer)

		return () => this.#observables[key].remove(observer)
	}

	/**
	 * Updates the specified key in the observables with the current value from the state.
	 * @param key The key to update in the observables.
	 */
	#update<K extends ExecutorKeys>(key: K) {
		this.#observables[key].update(this.get(key))
	}
}
