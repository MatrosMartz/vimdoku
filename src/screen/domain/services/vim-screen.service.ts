import { inject } from '~/share/utils'

import {
	type DialogData,
	DialogKind,
	IDLE_DIALOG,
	IDLE_MAIN_SCREEN,
	type IScreen,
	MainScreenKind,
	type VimScreen,
} from '../models'
import { ScreenObs } from './vim-screen-obs.service'

/** Represent a VIM-like Screen Service for Sudoku game. */
export class ScreenSvc implements IScreen {
	#dialog: DialogData = { ...IDLE_DIALOG }
	#main = IDLE_MAIN_SCREEN
	readonly #obs = inject(ScreenObs)
	#prev: null | MainScreenKind = null

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
			this.#dialog = { ...IDLE_DIALOG }
			this.#prev = null
		} else if (this.#dialog.kind !== DialogKind.None) {
			this.#dialog = { ...IDLE_DIALOG }
		}
		this.#obs.set(this.data)
	}

	setDialog(dialog: DialogData) {
		if (dialog.kind === DialogKind.Pause && this.#main !== MainScreenKind.Game) return
		this.#dialog = structuredClone(dialog)
		this.#obs.set(this.data)
	}

	setMain(main: MainScreenKind) {
		this.#prev = main === MainScreenKind.Start ? null : this.#main
		this.#main = main
		this.#dialog = { ...IDLE_DIALOG }
		this.#obs.set(this.data)
	}
}
