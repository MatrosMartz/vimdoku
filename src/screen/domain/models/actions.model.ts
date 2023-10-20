import type { Observer } from '~/share/domain/models'

import type { MainScreenKinds } from './main.model'
import type { DialogData, VimScreen } from './vim-screen.model'

export enum ScreenActions {
	ExitScreen = 'exit-screen',
	OpenDialog = 'open-dialog',
	OpenScreen = 'open-screen',
}

export interface OpenScreenData {
	screen: MainScreenKinds
}

export type ScreenData = DialogData | OpenScreenData

export type ScreenDispatchArgs =
	| { data?: null; action: ScreenActions.ExitScreen }
	| { action: ScreenActions.OpenDialog; data: DialogData }
	| { action: ScreenActions.OpenScreen; data: OpenScreenData }

export interface ScreenSubscribeArgs {
	observer: Observer<VimScreen>
	on: 'screen'
}
