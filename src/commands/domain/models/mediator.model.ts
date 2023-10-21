import type { IObservable, RemoveObserver, SubscriberData } from '~/share/domain/models'
import type { PrefDispatch, Preferences } from '$preferences/domain/models'
import type { ScreenDispatch, ScreenDispatchUnData, VimScreen } from '$screen/domain/models'
import type { Board, ModeKinds, SudokuDispatch, SudokuDispatchUnData } from '$sudoku/domain/models'

export type MediatorDispatch = ScreenDispatch & SudokuDispatch & PrefDispatch

export type DispatchActions = keyof MediatorDispatch

export type DispatchUnDataActions = ScreenDispatchUnData | SudokuDispatchUnData

export interface MediatorSubscribers {
	board: IObservable<Board | null | undefined>
	modes: IObservable<ModeKinds | null | undefined>
	preferences: IObservable<Preferences>
	screen: IObservable<VimScreen>
}

export type SubscribersKeys = keyof MediatorSubscribers

export type MediatorObservers = {
	[K in SubscribersKeys]: MediatorSubscribers[K]['update']
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
	 * Retrieves data using a subscriber key.
	 * @param subscriber The key representing the subscriber from which to retrieve data.
	 * @returns The data associated with the provided key.
	 */
	get<S extends SubscribersKeys>(subscriber: S): SubscriberData<MediatorSubscribers[S]>
	/**
	 * Asynchronously loads data.
	 * @returns A promise that resolves when loading is complete.
	 */
	load(): Promise<void>
	/**
	 * Subscribes an observer to a specific subscriber.
	 * @param subscriber The key of the subscriber to which the observer should subscribe.
	 * @param observer The observer function or object.
	 * @returns A function to remove the observer's subscription.
	 */
	subscribe<S extends SubscribersKeys>(subscriber: S, observer: MediatorObservers[S]): RemoveObserver
}
