import type { IObservable, Observer, Position, RemoveObserver } from '~/share/domain/models'
import type { PrefDispatch, Preferences } from '$preferences/domain/models'
import type { ScreenDispatch, ScreenDispatchUnData, VimScreen } from '$screen/domain/models'
import type { Board, ModeKinds, SudokuDispatch, SudokuDispatchUnData } from '$sudoku/domain/models'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Mediator {
	export type DataDispatch = ScreenDispatch & SudokuDispatch & PrefDispatch

	export type DataActions = keyof DataDispatch

	export type UnDataActions = ScreenDispatchUnData | SudokuDispatchUnData

	export type Actions = DataActions | UnDataActions

	export interface State {
		board?: Board | null
		modes?: ModeKinds | null
		position?: Position | null
		timer?: string | null
		preferences: Preferences
		screen: VimScreen
	}

	export type Keys = keyof State

	export type Observables = {
		[K in Keys]: IObservable<State[K]>
	}

	export type Observers = {
		[K in Keys]: Observer<State[K]>
	}
}

export interface IMediator {
	/**
	 * Dispatches an action to the mediator without associated data.
	 * @param action The action to be dispatched.
	 * @returns The updated Executor.
	 */
	dispatch<Action extends Mediator.UnDataActions>(action: Action): this
	/**
	 * Dispatches an action to the mediator with associated data.
	 * @param action The action to be dispatched.
	 * @param data The data associated with the action.
	 * @returns The updated Executor.
	 */
	dispatch<Action extends Mediator.DataActions>(action: Action, data: Mediator.DataDispatch[Action]): this
	/**
	 * Retrieves the current state of a specific observable.
	 * @param key The key of the observable from which to retrieve data.
	 * @returns The data associated with the provided key.
	 */
	get<K extends Mediator.Keys>(key: K): Mediator.State[K]
	/**
	 * Asynchronously loads data.
	 * @returns A promise that resolves when loading is complete.
	 */
	load(): Promise<void>
	/**
	 * Subscribes an observer to a specific observable.
	 * @param key The key of the observable to which the observer should subscribe.
	 * @param observer The observer function or object.
	 * @returns A function to remove the observer's subscription.
	 */
	subscribe<K extends Mediator.Keys>(key: K, observer: Mediator.Observers[K]): RemoveObserver
}
