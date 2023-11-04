import { type DialogData, DialogKinds, type IScreen, MainScreenKinds, type VimScreen } from '../models'

const { freeze: _f } = Object

/** Represent a VIM-like Screen Service for Sudoku game. */
export class ScreenService implements IScreen {
	/** Define default values for screen. */
	static readonly DEFAULT_SCREEN = _f<VimScreen>({
		dialog: _f({ kind: DialogKinds.None, opts: null }),
		main: MainScreenKinds.Start,
	})

	#dialog: DialogData = ScreenService.DEFAULT_SCREEN.dialog
	#main = ScreenService.DEFAULT_SCREEN.main
	#prev: null | MainScreenKinds = null

	get data(): VimScreen {
		return { dialog: this.#dialog, main: this.#main }
	}

	get dialog() {
		return this.#dialog
	}

	get mainScreen() {
		return this.#main
	}

	close() {
		if (this.#dialog.kind !== DialogKinds.None) this.#dialog = structuredClone(ScreenService.DEFAULT_SCREEN.dialog)
		else if (this.#prev != null) {
			this.#main = structuredClone(this.#prev)
			this.#prev = null
		}
	}

	setDialog(dialog: DialogData) {
		this.#dialog = structuredClone(dialog)
	}

	setMain(main: MainScreenKinds) {
		this.#prev = this.#main
		this.#main = main
	}
}
