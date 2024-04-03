import { inject } from '~/share/utils'
import type { Lang } from '$i18n/domain/const'

import { IDLE_MODAL, IDLE_ROUTE, Modal, Route } from '../entities'
import { type IScreen, type VimScreen } from '../models'
import type { PageRepo } from '../repositories'
import { ScreenObs } from './vim-screen-obs.service'

interface ScreenOpts {
	repo: PageRepo
}

/** Represent a VIM-like Screen Service for Sudoku game. */
export class ScreenSvc implements IScreen {
	#lang?: Lang
	#unsubscribe?: () => void
	readonly #obs = inject(ScreenObs)
	#prev: null | Route = null
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

	get route() {
		return this.#obs.data.route
	}

	async close() {
		await this.#repo.update(screen => {
			const { modal } = this.#obs.data
			if (Modal.isWin(modal)) return screen.with({ route: IDLE_ROUTE })
			if (Modal.isNone(modal) && this.#prev != null) return screen.with({ route: this.#prev })
			return screen
		})

		this.#obs.update(({ modal, route }) => {
			if (Modal.isWin(modal)) return { route: IDLE_ROUTE, modal: IDLE_MODAL }
			else if (!Modal.isNone(modal)) return { route, modal: IDLE_MODAL }
			else if (this.#prev != null) return { route: this.#prev, modal: IDLE_MODAL }

			return { modal, route }
		})
	}

	async gotTo(route: Route) {
		this.#obs.update(screen => {
			this.#prev = Route.isHome(route) ? null : screen.route

			return { route, modal: IDLE_MODAL }
		})

		await this.#repo.update(full => full.with({ route }))
	}

	async load() {
		const { route, lang } = await this.#repo.get()
		this.#lang = lang
		this.#obs.set({ modal: IDLE_MODAL, route })

		this.#unsubscribe = this.#repo.subscribe(({ lang, route }) => {
			this.#lang = lang
			this.#obs.set({ modal: IDLE_MODAL, route })
		})
	}

	async setLang(lang: Lang) {
		this.#lang = lang
		await this.#repo.update(full => full.with({ lang }))
	}

	setModal(modal: Modal) {
		this.#obs.update(({ route }) => {
			if ((Modal.isPause(modal) || Modal.isWin(modal)) && Route.isGame(route)) return { modal, route }
			return { modal, route }
		})
	}

	async unload() {
		this.#unsubscribe?.()
	}
}
