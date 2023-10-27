import type { IObservable, Observer, RemoveObserver } from '~/share/domain/models'

import type { Suggestion } from './suggestions.model'

export interface ExecutorState {
	history: string[]
	suggestions: Suggestion[]
}

export type ExecutorKeys = keyof ExecutorState

export type ExecutorObservables = {
	[K in ExecutorKeys]: IObservable<ExecutorState[K]>
}

export type ExecutorObservers = {
	[k in ExecutorKeys]: Observer<ExecutorState[k]>
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
	get<K extends ExecutorKeys>(key: K): ExecutorState[K]
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
	subscribe<K extends ExecutorKeys>(key: K, observer: ExecutorObservers[K]): RemoveObserver
}
