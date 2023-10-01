import {
	DialogKinds,
	type DialogOpts,
	type HelpDialogKinds,
	type IScreen,
	MainScreenKinds,
	type PrefDialogKinds,
	type VimScreen,
} from '../models'

const { freeze: _f } = Object

/** Represent a VIM-like Screen Service for Sudoku game. */
export class ScreenService implements IScreen {
	/** Define default values for screen. */
	static readonly DEFAULT_SCREEN = _f<VimScreen>({
		dialog: DialogKinds.None,
		main: MainScreenKinds.Init,
	})

	#dialogOpts: DialogOpts = null
	#value: VimScreen = { ...ScreenService.DEFAULT_SCREEN }

	get dialog() {
		return this.#value.dialog
	}

	get dialogOpts() {
		return this.#dialogOpts
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
