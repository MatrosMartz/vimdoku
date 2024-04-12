import { inject } from '~/share/utils'
import type { Lang } from '$i18n/domain/const'

import { IDLE_MODAL, IDLE_ROUTE, Modal, Page, RouteBase } from '../entities'
import { type IScreen, type VimScreen } from '../models'
import type { PageRepo } from '../repositories'
import { ScreenObs } from './vim-screen-obs.service'

/** Represent a VIM-like Screen Service for Sudoku game. */
export class ScreenSvc implements IScreen {
	#lang?: Lang
	readonly #obs = inject(ScreenObs)
	#prev: null | RouteBase = null
	readonly #save

	constructor(save: (data: Page) => Promise<void>) {
		this.#save = save
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

	get route() {
		return this.#obs.data.route
	}

	static create(repo: PageRepo) {
		return new ScreenSvc(repo.save)
	}

	close() {
		this.#obs.update(({ modal, route }) => {
			if (Modal.isWin(modal)) return { route: IDLE_ROUTE, modal: IDLE_MODAL }
			else if (!Modal.isNone(modal)) return { route, modal: IDLE_MODAL }
			else if (this.#prev != null) return { route: this.#prev, modal: IDLE_MODAL }

			return { modal, route }
		})
		return this
	}

	async save() {
		await this.#save(new Page({ lang: this.#lang, route: this.#obs.data.route }))
	}

	setLang(lang?: Lang) {
		this.#lang = lang
		return this
	}

	setModal(modal: Modal) {
		this.#obs.update(({ route }) => {
			const isPauseOrWin = Modal.isPause(modal) || Modal.isWin(modal)
			if (isPauseOrWin && RouteBase.isGame(route)) return { modal, route }
			return { modal, route }
		})
		return this
	}

	setRoute(route: RouteBase) {
		this.#obs.update(screen => {
			this.#prev = RouteBase.isHome(route) ? null : screen.route

			return { route, modal: IDLE_MODAL }
		})

		return this
	}
}
