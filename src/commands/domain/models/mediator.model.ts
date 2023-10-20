import type { RemoveObserver } from '~/share/domain/models'
import type { PrefDispatchArgs, PrefSubscriberArgs } from '$preferences/domain/models'
import type { ScreenDispatchArgs, ScreenSubscribeArgs } from '$screen/domain/models'
import type { BoardSubscriberArgs, GameDispatchArgs, ModesSubscriberArgs } from '$sudoku/domain/models'

export type DispatchArgs = ScreenDispatchArgs | GameDispatchArgs | PrefDispatchArgs

export type SubscriberArgs = BoardSubscriberArgs | ModesSubscriberArgs | PrefSubscriberArgs | ScreenSubscribeArgs

export interface IVimMediator {
	/**
	 * Dispatches events based on the provided arguments.
	 * @param args The arguments for dispatching events.
	 */
	dispatch(args: DispatchArgs): void
	/**
	 * Asynchronously loads data.
	 * @returns A promise that resolves when loading is complete.
	 */
	load(): Promise<void>
	/**
	 * Subscribes to events based on the provided arguments and returns a function to remove the observer.
	 * @param args The arguments for subscribing to events.
	 * @returns A function that can be called to remove the observer.
	 */
	subscribe(args: SubscriberArgs): RemoveObserver
}
