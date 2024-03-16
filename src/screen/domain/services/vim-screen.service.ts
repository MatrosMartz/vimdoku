import { inject } from '~/share/utils'
import type { Lang } from '$pref/domain/models'

import { IDLE_MODAL, IDLE_ROUTE, ModalEntity, Page } from '../entities'
import { type IScreen, type VimScreen } from '../models'
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
		this.#obs.set({ modal: IDLE_MODAL, route: this.#repo.get().page })
	}

	get data(): VimScreen {
		return this.#obs.data
	}

	get lang() {
		return this.#repo.get().lang
	}

	get modal() {
		return this.#obs.data.modal
	}

	get route() {
		return this.#obs.data.route
	}

	close() {
		this.#obs.update(({ modal, route }) => {
			if (ModalEntity.isWin(modal)) {
				this.#repo.update(full => full.withPage(IDLE_ROUTE))
				return { route: IDLE_ROUTE, modal: IDLE_MODAL }
			} else if (!ModalEntity.isNone(modal)) return { route, modal: IDLE_MODAL }
			else if (this.#prev != null) {
				this.#repo.update(full => full.withPage(this.#prev!))
				return { route: this.#prev, modal: IDLE_MODAL }
			}
			return { modal, route }
		})
	}

	gotTo(route: Page) {
		this.#obs.update(screen => {
			this.#prev = Page.isHome(route) ? null : screen.route

			return { route, modal: IDLE_MODAL }
		})

		this.#repo.update(full => full.withPage(route))
	}

	setLang(lang: Lang) {
		this.#repo.update(full => full.withLang(lang))
	}

	setModal(modal: ModalEntity) {
		this.#obs.update(({ route }) => {
			if ((ModalEntity.isPause(modal) || ModalEntity.isWin(modal)) && Page.isGame(route)) return { modal, route }
			return { modal, route }
		})
	}
}
