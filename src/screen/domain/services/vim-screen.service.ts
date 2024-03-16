import { inject } from '~/share/utils'
import type { Lang } from '$pref/domain/models'

import { IDLE_ROUTE, Page } from '../entities'
import { type DialogData, DialogKind, IDLE_DIALOG, type IScreen, type VimScreen } from '../models'
import type { RouteRepo } from '../repositories'
import { ScreenObs } from './vim-screen-obs.service'

interface ScreenOpts {
	repo: RouteRepo
}

/** Represent a VIM-like Screen Service for Sudoku game. */
export class ScreenSvc implements IScreen {
	readonly #obs = inject(ScreenObs)
	#prev: null | Page = null
	readonly #repo

	constructor({ repo }: ScreenOpts) {
		this.#repo = repo
		this.#obs.set({ dialog: IDLE_DIALOG, route: this.#repo.get().page })
	}

	get data(): VimScreen {
		return this.#obs.data
	}

	get dialog() {
		return this.#obs.data.dialog
	}

	get lang() {
		return this.#repo.get().lang
	}

	get route() {
		return this.#obs.data.route
	}

	close() {
		this.#obs.update(({ dialog, route }) => {
			if (dialog.kind === DialogKind.Win) {
				this.#repo.update(full => full.withPage(IDLE_ROUTE))
				return { route: IDLE_ROUTE, dialog: { ...IDLE_DIALOG } }
			} else if (dialog.kind !== DialogKind.None) return { route, dialog: { ...IDLE_DIALOG } }
			else if (this.#prev != null) {
				this.#repo.update(full => full.withPage(this.#prev!))
				return { route: this.#prev, dialog: { ...IDLE_DIALOG } }
			}
			return { dialog, route }
		})
	}

	gotTo(route: Page) {
		this.#obs.update(screen => {
			this.#prev = Page.isHome(route) ? null : screen.route

			return { route, dialog: { ...IDLE_DIALOG } }
		})

		this.#repo.update(full => full.withPage(route))
	}

	setDialog(dialog: DialogData) {
		this.#obs.update(({ dialog: prevDialog, route }) => {
			if (dialog.kind === DialogKind.Pause && Page.isGame(route)) return { dialog, prevDialog, route }
			return { dialog, route }
		})
	}

	setLang(lang: Lang) {
		this.#repo.update(full => full.withLang(lang))
	}
}
