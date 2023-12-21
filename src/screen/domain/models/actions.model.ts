import type { MainScreenKind } from './main.model'
import type { DialogData } from './vim-screen.model'

export enum ScreenAction {
	Exit = 'exit-screen',
	OpenDialog = 'open-dialog',
	OpenScreen = 'open-screen',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ScreenData {
	export interface OpenScreen {
		screen: MainScreenKind
	}

	export type OpenDialog = DialogData
}

export type ScreenDispatchUnData = ScreenAction.Exit

export interface ScreenDispatch {
	[ScreenAction.OpenDialog]: ScreenData.OpenDialog
	[ScreenAction.OpenScreen]: ScreenData.OpenScreen
}
