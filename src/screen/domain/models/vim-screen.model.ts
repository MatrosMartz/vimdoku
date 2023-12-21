import type { DialogKind } from './dialog.model'
import { type MainScreenKind } from './main.model'

export interface HelpDialogOpts {
	search: string
}

export interface InLnDialogOpts {
	type: 'modes' | 'position'
}

export type DialogOpts = HelpDialogOpts | null | undefined

export type DialogsWithoutOpts =
	| DialogKind.Cmd
	| DialogKind.None
	| DialogKind.Pause
	| DialogKind.PrefAll
	| DialogKind.PrefDiff
	| DialogKind.PrefEdit
	| DialogKind.sel
	| DialogKind.Win

export type DialogData =
	| { opts?: null; kind: DialogsWithoutOpts }
	| { kind: DialogKind.InLn; opts: InLnDialogOpts }
	| { kind: DialogKind.Help; opts: HelpDialogOpts }

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
