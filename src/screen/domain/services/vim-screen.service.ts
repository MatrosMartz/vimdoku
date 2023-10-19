import { type DialogData, DialogKinds, type IScreen, MainScreenKinds, type VimScreen } from '../models'

const { freeze: _f } = Object

/** Represent a VIM-like Screen Service for Sudoku game. */
export class ScreenService implements IScreen {
	/** Define default values for screen. */
	static readonly DEFAULT_SCREEN = _f<VimScreen>({
		dialog: _f({ kind: DialogKinds.None, opts: null }),
		main: MainScreenKinds.Init,
	})

	#dialog: DialogData = ScreenService.DEFAULT_SCREEN.dialog
	#main = ScreenService.DEFAULT_SCREEN.main

	get data(): VimScreen {
		return { dialog: this.#dialog, main: this.#main }
	}

	get dialog() {
		return this.#dialog
	}

	get mainScreen() {
		return this.#main
	}

	setDialog(dialog: DialogData) {
		this.#dialog = structuredClone(dialog)
	}

	setMain(main: MainScreenKinds) {
		this.#main = main
	}
}
