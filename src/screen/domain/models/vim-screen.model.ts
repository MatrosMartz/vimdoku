import type { DialogKinds } from './dialog.model'
import { type MainScreenKinds } from './main.model'

export interface HelpDialogOpts {
	search: string
}

export interface InLnDialogOpts {
	type: 'modes' | 'position'
}

export type DialogOpts = HelpDialogOpts | null | undefined

export type DialogData =
	| {
			opts?: null
			kind:
				| DialogKinds.Cmd
				| DialogKinds.None
				| DialogKinds.pause
				| DialogKinds.PrefAll
				| DialogKinds.PrefDiff
				| DialogKinds.PrefEdit
				| DialogKinds.sel
				| DialogKinds.Win
	  }
	| { kind: DialogKinds.InLn; opts: InLnDialogOpts }
	| { kind: DialogKinds.Help; opts: HelpDialogOpts }

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
