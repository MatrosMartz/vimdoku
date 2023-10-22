import type { IObservable, Observer, Position, RemoveObserver } from '~/share/domain/models'
import type { PrefDispatch, Preferences } from '$preferences/domain/models'
import type { ScreenDispatch, ScreenDispatchUnData, VimScreen } from '$screen/domain/models'
import type { Board, ModeKinds, SudokuDispatch, SudokuDispatchUnData } from '$sudoku/domain/models'

export type MediatorDispatch = ScreenDispatch & SudokuDispatch & PrefDispatch

export type DispatchActions = keyof MediatorDispatch

export type DispatchUnDataActions = ScreenDispatchUnData | SudokuDispatchUnData

export interface MediatorState {
	board?: Board | null
	modes?: ModeKinds | null
	position?: Position | null
	preferences: Preferences
	screen: VimScreen
}

export type StateKeys = keyof MediatorState

export type MediatorObservables = {
	[K in StateKeys]: IObservable<MediatorState[K]>
}

export type MediatorObservers = {
	[K in StateKeys]: Observer<MediatorState[K]>
}

export interface IMediator {
	/**
	 * Dispatches an action to the mediator without associated data.
	 * @param action The action to be dispatched.
	 */
	dispatch<Action extends DispatchUnDataActions>(action: Action): void
	/**
	 * Dispatches an action to the mediator with associated data.
	 * @param action The action to be dispatched.
	 * @param data The data associated with the action.
	 */
	dispatch<Action extends DispatchActions>(action: Action, data: MediatorDispatch[Action]): void
	/**
	 * Retrieves the current state of a specific observable.
	 * @param key The key of the observable from which to retrieve data.
	 * @returns The data associated with the provided key.
	 */
	get<K extends StateKeys>(key: K): MediatorState[K]
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
	subscribe<K extends StateKeys>(key: K, observer: MediatorObservers[K]): RemoveObserver
}
