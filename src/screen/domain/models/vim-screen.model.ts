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
	get data(): VimScreen
	/** Get the current dialog. */
	get dialog(): DialogKinds
	/** Get the current dialogOpts */
	get dialogOpts(): DialogOpts
	/** Get the current main screen. */
	get mainScreen(): MainScreenKinds
	/** Set dialog and options. */
	setDialog(dialog: DialogKinds, opts: DialogOpts): void
	/** Set main screen. */
	setMain(main: MainScreenKinds): void
}
