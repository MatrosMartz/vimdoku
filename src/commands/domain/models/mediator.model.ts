import type { II18n } from '$i18n/domain/models'
import type { IPage } from '$page/domain/models'
import type { IPrefs } from '$pref/domain/models'
import type { ISudoku } from '$sudoku/domain/models'

export interface State {
	readonly i18n: II18n
	readonly page: IPage
	readonly prefs: IPrefs
	readonly sudoku: ISudoku
}

export type DataAction = Record<string, unknown>

export type ActionUnData = (states: State) => Promise<void>
export type ActionWithData<Data extends DataAction> = (states: State, data: Data) => Promise<void>

export type Action<Data extends DataAction | never = never> = Data extends never ? ActionUnData : ActionWithData<Data>

export interface IMed {
	/**
	 * Dispatches an action to the mediator without associated data.
	 * @param action The action to be dispatched.
	 * @param data The data associated with the action.
	 * @returns The updated Executor.
	 */
	dispatch<Data extends DataAction | never>(action: Action<Data>, data?: Data): this
	/**
	 * Asynchronously loads data.
	 * @returns A promise that resolves when loading is complete.
	 */
	load(): Promise<void>
	unload(): Promise<void>
}
