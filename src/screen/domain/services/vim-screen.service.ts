import { inject } from '~/share/utils'
import type { Lang } from '$pref/domain/models'

import { IDLE_MODAL, IDLE_PAGE, Modal, Page } from '../entities'
import { type IScreen, type VimScreen } from '../models'
import type { PageRepo } from '../repositories'
import { ScreenObs } from './vim-screen-obs.service'

interface ScreenOpts {
	repo: PageRepo
}

/** Represent a VIM-like Screen Service for Sudoku game. */
export class ScreenSvc implements IScreen {
	#lang?: Lang
	readonly #obs = inject(ScreenObs)
	#prev: null | Page = null
	readonly #repo

	constructor({ repo }: ScreenOpts) {
		this.#repo = repo
	}

	get data(): VimScreen {
		return this.#obs.data
	}

	get lang() {
		return this.#lang
	}

	get modal() {
		return this.#obs.data.modal
	}

	get page() {
		return this.#obs.data.page
	}

	async close() {
		await this.#repo.update(screen => {
			const { modal } = this.#obs.data
			if (Modal.isWin(modal)) return screen.withPage(IDLE_PAGE)
			if (Modal.isNone(modal) && this.#prev != null) return screen.withPage(this.#prev)
			return screen
		})

		this.#obs.update(({ modal, page }) => {
			if (Modal.isWin(modal)) return { page: IDLE_PAGE, modal: IDLE_MODAL }
			else if (!Modal.isNone(modal)) return { page, modal: IDLE_MODAL }
			else if (this.#prev != null) return { page: this.#prev, modal: IDLE_MODAL }

			return { modal, page }
		})
	}

	async gotTo(page: Page) {
		this.#obs.update(screen => {
			this.#prev = Page.isHome(page) ? null : screen.page

			return { page, modal: IDLE_MODAL }
		})

		await this.#repo.update(full => full.withPage(page))
	}

	async load() {
		const { page, lang } = await this.#repo.get()
		this.#lang = lang
		this.#obs.set({ modal: IDLE_MODAL, page })
	}

	async setLang(lang: Lang) {
		this.#lang = lang
		await this.#repo.update(full => full.withLang(lang))
	}

	setModal(modal: Modal) {
		this.#obs.update(({ page }) => {
			if ((Modal.isPause(modal) || Modal.isWin(modal)) && Page.isGame(page)) return { modal, page }
			return { modal, page }
		})
	}
}
