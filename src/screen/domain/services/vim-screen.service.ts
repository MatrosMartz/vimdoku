import type { IObs } from '~/share/domain/models'

import { type DialogData, DialogKind, type IScreen, MainScreenKind, type VimScreen } from '../models'

const { freeze: _f } = Object

/** Represent a VIM-like Screen Service for Sudoku game. */
export class ScreenSvc implements IScreen {
	/** Define default values for screen. */
	static readonly DEFAULT_SCREEN = _f<VimScreen>({
		dialog: _f({ kind: DialogKind.None }),
		main: MainScreenKind.Start,
	})

	#dialog: DialogData = ScreenSvc.DEFAULT_SCREEN.dialog
	#main = ScreenSvc.DEFAULT_SCREEN.main
	readonly #obs
	#prev: null | MainScreenKind = null

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
		if (this.#dialog.kind === DialogKind.Win) {
			this.#main = MainScreenKind.Start
			this.#dialog = structuredClone(ScreenSvc.DEFAULT_SCREEN.dialog)
			this.#prev = null
		} else if (this.#dialog.kind !== DialogKind.None) {
			this.#dialog = structuredClone(ScreenSvc.DEFAULT_SCREEN.dialog)
		}
		this.#obs.update(this.data)
	}

	setDialog(dialog: DialogData) {
		if (dialog.kind === DialogKind.Pause && this.#main !== MainScreenKind.Game) return
		this.#dialog = structuredClone(dialog)
		this.#obs.update(this.data)
	}

	setMain(main: MainScreenKind) {
		this.#prev = main === MainScreenKind.Start ? null : this.#main
		this.#main = main
		this.#dialog = structuredClone(ScreenSvc.DEFAULT_SCREEN.dialog)
		this.#obs.update(this.data)
	}
}
