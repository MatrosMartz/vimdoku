import type { IAsyncContext, IContext, Pos } from '~/share/domain/models'
import type { PrefDispatch, Prefs } from '$pref/domain/models'
import type { ScreenDispatch, ScreenDispatchUnData, VimScreen } from '$screen/domain/models'
import type { Board, ModeKinds, SudokuDispatch, SudokuDispatchUnData } from '$sudoku/domain/models'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Mediator {
	export type DataDispatch = ScreenDispatch & SudokuDispatch & PrefDispatch

	export type DataActions = keyof DataDispatch

	export type UnDataActions = ScreenDispatchUnData | SudokuDispatchUnData

	export type Actions = DataActions | UnDataActions

	export interface State {
		board: IAsyncContext<Board | null>
		boardSaved: IAsyncContext<boolean>
		mode: IContext<ModeKinds>
		position: IContext<Pos>
		preferences: IAsyncContext<Prefs>
		screen: IContext<VimScreen>
		timer: IAsyncContext<string>
	}

	export type Keys = keyof State
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
	 * Asynchronously loads data.
	 * @returns A promise that resolves when loading is complete.
	 */
	load(): Promise<void>
}
