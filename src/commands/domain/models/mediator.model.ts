import type { PrefDispatch } from '$pref/domain/models'
import type { ScreenDispatch, ScreenDispatchUnData } from '$screen/domain/models'
import type { SudokuDispatch, SudokuDispatchUnData } from '$sudoku/domain/models'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Med {
	export type DataDispatch = ScreenDispatch & SudokuDispatch & PrefDispatch

	export type DataActions = keyof DataDispatch

	export type UnDataActions = ScreenDispatchUnData | SudokuDispatchUnData

	export type Actions = DataActions | UnDataActions
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
