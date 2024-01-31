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
	readonly #obs = inject(ScreenObs)
	#prev: null | MainScreenKind = null

	get data(): VimScreen {
		return this.#obs.data
	}

	get dialog() {
		return this.#obs.data.dialog
	}

	get mainScreen() {
		return this.#obs.data.main
	}

	close() {
		this.#obs.update(({ dialog, main }) => {
			if (dialog.kind === DialogKind.Win) return { main: IDLE_MAIN_SCREEN, dialog: { ...IDLE_DIALOG } }
			else if (dialog.kind !== DialogKind.None) return { main, dialog: { ...IDLE_DIALOG } }
			else if (this.#prev != null) return { main: this.#prev, dialog: { ...IDLE_DIALOG } }
			return { dialog, main }
		})
	}

	setDialog(dialog: DialogData) {
		this.#obs.update(({ dialog: prevDialog, main }) => {
			if (dialog.kind === DialogKind.Pause && main !== MainScreenKind.Game) return { dialog, prevDialog, main }
			return { dialog, main }
		})
	}

	setMain(main: MainScreenKind) {
		this.#obs.update(screen => {
			this.#prev = main === MainScreenKind.Start ? null : screen.main

			return { main, dialog: { ...IDLE_DIALOG } }
		})
	}
}
