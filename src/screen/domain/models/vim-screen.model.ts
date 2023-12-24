import { type DialogData, IDLE_DIALOG } from './dialog.model'
import { IDLE_MAIN_SCREEN, type MainScreenKind } from './main.model'

export interface VimScreen {
	dialog: DialogData
	main: MainScreenKind
}

export interface IScreen {
	/** Get the current main screen and dialog. */
	readonly data: VimScreen
	/** Get the current dialog. */
	readonly dialog: DialogData
	/** Get the current main screen. */
	readonly mainScreen: MainScreenKind
	/** Return to previous screen or close dialog. */
	close(): void
	/** Set dialog and options. */
	setDialog(dialog: DialogData): void
	/** Set main screen. */
	setMain(main: MainScreenKind): void
}

export const IDLE_SCREEN = { dialog: IDLE_DIALOG, main: IDLE_MAIN_SCREEN } as const satisfies VimScreen
