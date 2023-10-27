import type { IObservable, Observer, Position, RemoveObserver } from '~/share/domain/models'
import type { PrefDispatch, Preferences } from '$preferences/domain/models'
import type { ScreenDispatch, ScreenDispatchUnData, VimScreen } from '$screen/domain/models'
import type { Board, ModeKinds, SudokuDispatch, SudokuDispatchUnData } from '$sudoku/domain/models'

export type MediatorDispatch = ScreenDispatch & SudokuDispatch & PrefDispatch

export type MediatorActions = keyof MediatorDispatch

export type MediatorUnDataActions = ScreenDispatchUnData | SudokuDispatchUnData

export type AllMediatorActions = MediatorActions | MediatorUnDataActions

export interface MediatorState {
	board?: Board | null
	modes?: ModeKinds | null
	position?: Position | null
	timer?: string | null
	preferences: Preferences
	screen: VimScreen
}

export type MediatorKeys = keyof MediatorState

export type MediatorObservables = {
	[K in MediatorKeys]: IObservable<MediatorState[K]>
}

export type MediatorObservers = {
	[K in MediatorKeys]: Observer<MediatorState[K]>
}

export interface IMediator {
	/**
	 * Dispatches an action to the mediator without associated data.
	 * @param action The action to be dispatched.
	 * @returns The updated Executor.
	 */
	dispatch<Action extends MediatorUnDataActions>(action: Action): this
	/**
	 * Dispatches an action to the mediator with associated data.
	 * @param action The action to be dispatched.
	 * @param data The data associated with the action.
	 * @returns The updated Executor.
	 */
	dispatch<Action extends MediatorActions>(action: Action, data: MediatorDispatch[Action]): this
	/**
	 * Retrieves the current state of a specific observable.
	 * @param key The key of the observable from which to retrieve data.
	 * @returns The data associated with the provided key.
	 */
	get<K extends MediatorKeys>(key: K): MediatorState[K]
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
	subscribe<K extends MediatorKeys>(key: K, observer: MediatorObservers[K]): RemoveObserver
}
