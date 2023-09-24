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

export interface IVimScreen {
	/** Get the current dialog. */
	get dialog(): DialogKinds
	/** Get the current main screen. */
	get mainScreen(): MainScreenKinds
	/** Set dialog and options. */
	setDialog(dialog: DialogKinds, opts: DialogOpts): void
	/** Set main screen. */
	setMain(main: MainScreenKinds): void
	/** Get the current main screen and dialog. */
	get value(): VimScreenValue
}

/** Represent a VIM-like screen for Sudoku game. */
export class VimScreen implements IVimScreen {
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

	get dialog() {
		return this.#value.dialog
	}

	get mainScreen() {
		return this.#value.main
	}

	get value() {
		return structuredClone(this.#value)
	}

	setDialog(dialog: DialogKinds.None): void
	setDialog(dialog: DialogKinds.Help, opts: HelpDialogKinds): void
	setDialog(dialog: DialogKinds.Pref, opts: PrefDialogKinds): void
	setDialog(dialog: DialogKinds, opts: DialogOpts = null) {
		this.#value = { ...this.#value, dialog }
		this.#dialogOpts = structuredClone(opts)
	}

	setMain(main: MainScreenKinds) {
		this.#value = { ...this.#value, main }
	}
}
