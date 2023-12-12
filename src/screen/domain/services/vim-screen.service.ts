import type { IObs } from '~/share/domain/models'

import { type DialogData, DialogKinds, type IScreen, MainScreenKinds, type VimScreen } from '../models'

const { freeze: _f } = Object

/** Represent a VIM-like Screen Service for Sudoku game. */
export class ScreenSvc implements IScreen {
	/** Define default values for screen. */
	static readonly DEFAULT_SCREEN = _f<VimScreen>({
		dialog: _f({ kind: DialogKinds.None }),
		main: MainScreenKinds.Start,
	})

	#dialog: DialogData = ScreenSvc.DEFAULT_SCREEN.dialog
	#main = ScreenSvc.DEFAULT_SCREEN.main
	readonly #obs
	#prev: null | MainScreenKinds = null

	constructor(obs: IObs<VimScreen>) {
		this.#obs = obs
	}

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
		if (this.#dialog.kind === DialogKinds.Win) {
			this.#main = MainScreenKinds.Start
			this.#dialog = structuredClone(ScreenSvc.DEFAULT_SCREEN.dialog)
			this.#prev = null
		} else if (this.#dialog.kind !== DialogKinds.None) this.#dialog = structuredClone(ScreenSvc.DEFAULT_SCREEN.dialog)
		else if (this.#prev != null) {
			this.#main = structuredClone(this.#prev)
			this.#prev = null
		}
		this.#obs.update(this.data)
	}

	setDialog(dialog: DialogData) {
		this.#dialog = structuredClone(dialog)
		this.#obs.update(this.data)
	}

	setMain(main: MainScreenKinds) {
		this.#prev = this.#main
		this.#main = main
		this.#obs.update(this.data)
	}
}
