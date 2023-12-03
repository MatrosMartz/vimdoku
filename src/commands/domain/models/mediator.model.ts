import type { IAsyncObs, IObs, Pos } from '~/share/domain/models'
import type { I18nData } from '$i18n/domain/models'
import type { PrefDispatch, Prefs } from '$pref/domain/models'
import type { ScreenDispatch, ScreenDispatchUnData, VimScreen } from '$screen/domain/models'
import type { Board, ModeKinds, SudokuDispatch, SudokuDispatchUnData } from '$sudoku/domain/models'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Med {
	export type DataDispatch = ScreenDispatch & SudokuDispatch & PrefDispatch

	export type DataActions = keyof DataDispatch

	export type UnDataActions = ScreenDispatchUnData | SudokuDispatchUnData

	export type Actions = DataActions | UnDataActions

	export interface State {
		board: IAsyncObs<Board | null>
		boardSaved: IAsyncObs<boolean>
		i18n: IAsyncObs<I18nData>
		mode: IObs<ModeKinds>
		pos: IObs<Pos>
		prefs: IAsyncObs<Prefs>
		screen: IObs<VimScreen>
		timer: IAsyncObs<string>
	}

	export type Keys = keyof State
}

export interface IMed {
	/**
	 * Dispatches an action to the mediator without associated data.
	 * @param action The action to be dispatched.
	 * @returns The updated Executor.
	 */
	dispatch<Action extends Med.UnDataActions>(action: Action): this
	/**
	 * Dispatches an action to the mediator with associated data.
	 * @param action The action to be dispatched.
	 * @param data The data associated with the action.
	 * @returns The updated Executor.
	 */
	dispatch<Action extends Med.DataActions>(action: Action, data: Med.DataDispatch[Action]): this
	/**
	 * Asynchronously loads data.
	 * @returns A promise that resolves when loading is complete.
	 */
	load(): Promise<void>
}
