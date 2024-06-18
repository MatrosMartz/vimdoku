import { inject, Prtcl } from '~/share/utils'
import type { Lang } from '$i18n/domain/const'

import { Modal, type Page, type Route } from '../entities'
import { type IPage } from '../models'
import type { PageRepo } from '../repositories'
import { PageObs } from './page-obs.service'

/** Represent a VIM-like Screen Service for Sudoku game. */
export class PageSvc implements IPage {
	readonly #go
	readonly #obs = inject(PageObs)
	readonly #save
	#savedPage = this.#obs.data

	constructor(go: (delta: 'back' | 'forward') => Promise<Page.Page>, save: (data: Page.Page) => Promise<void>) {
		this.#go = go
		this.#save = save
	}

	get data(): Page.Page {
		return this.#obs.data
	}

	static create(repo: PageRepo) {
		return new PageSvc(repo.go, repo.save)
	}

	async back() {
		const page = this.data
		this.#obs.set(Modal.None.is(page.modal) ? await this.#go('back') : page.with({ modal: Modal.IDLE }))
	}

	async save() {
		const page = this.data
		if (
			this.#savedPage != null &&
			this.#savedPage.route[Prtcl.equalsTo](page.route) &&
			this.#savedPage.lang === page.lang
		)
			return

		await this.#save(page)
		this.#savedPage = page
	}

	setLang(lang: Lang | undefined) {
		this.#obs.update(page => page.with({ lang }))
		return this
	}

	setModal(modal: Modal.Modal) {
		this.#obs.update(page => page.with({ modal }))
		return this
	}

	setRoute(route: Route.Route) {
		this.#obs.update(page => page.with({ modal: Modal.IDLE, route }))

		return this
	}
}
