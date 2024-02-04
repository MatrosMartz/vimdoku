import type { II18n } from '$i18n/domain/models'
import type { IPrefs } from '$pref/domain/models'
import type { IScreen } from '$screen/domain/models'
import type { IGame } from '$sudoku/domain/models'

export interface State {
	game: IGame
	i18n: II18n
	prefs: IPrefs
	screen: IScreen
}

export type DataAction = Record<string, unknown>

export type ActionUnData = (states: State) => Promise<State>
export type ActionWithData<Data extends DataAction> = (states: State, data: Data) => Promise<State>

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
}
