import type { HelpDialogKinds, PrefDialogKinds } from './dialog.entity'
import { DialogKinds } from './dialog.entity'
import { MainScreenKinds } from './main.entity'

export interface VimScreenValue {
	dialog: DialogKinds
	main: MainScreenKinds
}

export interface HelpDialogOpts {
	kind: HelpDialogKinds
}

export interface PrefDialogOpts {
	kind: PrefDialogKinds
}

const { freeze: _f } = Object

export type DialogOpts = HelpDialogKinds | PrefDialogKinds | null

/** Represent a VIM-like screen for Sudoku game. */
export class VimScreen {
	/**
	 * Define default values for screen
	 * @readonly
	 * @constant
	 */
	static readonly DEFAULT_SCREEN = _f<VimScreenValue>({
		dialog: DialogKinds.None,
		main: MainScreenKinds.Init,
	})

	#dialogOpts: DialogOpts = null
	#value: VimScreenValue = { ...VimScreen.DEFAULT_SCREEN }

	/** Get the current dialog. */
	get dialog() {
		return this.#value.dialog
	}

	/** Get the current main screen. */
	get main() {
		return this.#value.main
	}

	/** Set dialog and options. */
	setDialog(dialog: DialogKinds.None): void
	setDialog(dialog: DialogKinds.Help, opts: HelpDialogKinds): void
	setDialog(dialog: DialogKinds.Pref, opts: PrefDialogKinds): void
	setDialog(dialog: DialogKinds, opts: DialogOpts = null) {
		this.#value = { ...this.#value, dialog }
		this.#dialogOpts = structuredClone(opts)
	}

	/** Set Main screen. */
	setMain(main: MainScreenKinds) {
		this.#value = { ...this.#value, main }
	}
}
