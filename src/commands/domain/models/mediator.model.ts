import type { RemoveObserver } from '~/share/domain/models'
import type { PrefDispatchArgs, PrefSubscriberArgs } from '$preferences/domain/models'
import type { ScreenDispatchArgs, ScreenSubscribeArgs } from '$screen/domain/models'
import type { BoardSubscriberArgs, GameDispatchArgs, ModesSubscriberArgs } from '$sudoku/domain/models'

export type DispatchArgs = ScreenDispatchArgs | GameDispatchArgs | PrefDispatchArgs

export type SubscriberArgs = BoardSubscriberArgs | ModesSubscriberArgs | PrefSubscriberArgs | ScreenSubscribeArgs

export interface IVimMediator {
	dispatch(args: DispatchArgs): void

	load(): Promise<void>

	subscribe(args: SubscriberArgs): RemoveObserver
}
