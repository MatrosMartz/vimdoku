import type { MainScreenKinds } from './main.model'
import type { DialogData } from './vim-screen.model'

export enum ScreenActions {
	Exit = 'exit-screen',
	OpenDialog = 'open-dialog',
	OpenScreen = 'open-screen',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ScreenData {
	export interface OpenScreen {
		screen: MainScreenKinds
	}

	export type OpenDialog = DialogData
}

export type ScreenDispatchUnData = ScreenActions.Exit

export interface ScreenDispatch {
	[ScreenActions.OpenDialog]: ScreenData.OpenDialog
	[ScreenActions.OpenScreen]: ScreenData.OpenScreen
}
