import type { DialogKinds, HelpDialogKinds, PrefDialogKinds } from './dialog.model'
import { type MainScreenKinds } from './main.model'

export interface VimScreen {
	dialog: DialogKinds
	main: MainScreenKinds
}

export interface HelpDialogOpts {
	kind: HelpDialogKinds
}

export interface PrefDialogOpts {
	kind: PrefDialogKinds
}

export type DialogOpts = HelpDialogKinds | PrefDialogKinds | null

export interface IScreen {
	/** Get the current main screen and dialog. */
	readonly data: VimScreen
	/** Get the current dialog. */
	readonly dialog: DialogKinds
	/** Get the current dialogOpts */
	readonly dialogOpts: DialogOpts
	/** Get the current main screen. */
	readonly mainScreen: MainScreenKinds
	/** Set dialog and options. */
	setDialog(dialog: DialogKinds, opts: DialogOpts): void
	/** Set main screen. */
	setMain(main: MainScreenKinds): void
}
