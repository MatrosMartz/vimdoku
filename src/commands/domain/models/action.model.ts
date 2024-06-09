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
