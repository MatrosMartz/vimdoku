import type { IObservable, Observer, RemoveObserver } from '~/share/domain/models'

import type { Suggestion } from './suggestions.model'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Executor {
	export interface State {
		history: string[]
		suggestions: Suggestion[]
	}

	export type Keys = keyof State

	export type Observables = {
		[K in Keys]: IObservable<State[K]>
	}

	export type Observers = {
		[k in Keys]: Observer<State[k]>
	}
}

export interface IExecutor {
	/**
	 * Executes a command-like input.
	 * @param cmdLike The command-like input to execute.
	 * @returns The updated Executor.
	 */
	exec(cmdLike: string): this
	/**
	 * Retrieves the current state of a specific observable.
	 * @param key The key of the observable from which to retrieve data.
	 * @returns The data associated with the provided key.
	 */
	get<K extends Executor.Keys>(key: K): Executor.State[K]
	/**
	 * Searches for autocomplete suggestions based on the provided command-like input.
	 * @param cmdLike The command-like input to search for suggestions.
	 * @returns The updated Executor.
	 */
	searchAutocomplete(cmdLike: string): this
	/**
	 * Subscribes an observer to a specific observable.
	 * @param key The key of the observable to which the observer should subscribe.
	 * @param observer The observer function or object.
	 * @returns A function to remove the observer's subscription.
	 */
	subscribe<K extends Executor.Keys>(key: K, observer: Executor.Observers[K]): RemoveObserver
}
