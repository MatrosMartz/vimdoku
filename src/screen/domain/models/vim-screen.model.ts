import type { CmdDialogTypes, DialogKinds, HelpDialogTypes, PrefDialogTypes } from './dialog.model'
import { type MainScreenKinds } from './main.model'

export interface CmdDialogOpts {
	type: CmdDialogTypes
}

export interface HelpDialogOpts {
	type: HelpDialogTypes
}

export interface PrefDialogOpts {
	type: PrefDialogTypes
}

export type DialogOpts = HelpDialogOpts | PrefDialogOpts | null | undefined

export type DialogData =
	| { kind: DialogKinds.Cmd; opts: CmdDialogOpts }
	| { kind: DialogKinds.Help; opts: HelpDialogOpts }
	| { opts?: null; kind: DialogKinds.None }
	| { kind: DialogKinds.Pref; opts: PrefDialogOpts }

export interface VimScreen {
	dialog: DialogData
	main: MainScreenKinds
}

export interface IScreen {
	/** Get the current main screen and dialog. */
	readonly data: VimScreen
	/** Get the current dialog. */
	readonly dialog: DialogData
	/** Get the current main screen. */
	readonly mainScreen: MainScreenKinds
	/** Return to previous screen or close dialog. */
	close(): void
	/** Set dialog and options. */
	setDialog(dialog: DialogData): void
	/** Set main screen. */
	setMain(main: MainScreenKinds): void
}
