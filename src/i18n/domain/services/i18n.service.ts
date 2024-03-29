import type { PagesKeys } from '~/locales'
import type { RequireOne } from '~/share/types'
import { inArray, inject, option } from '~/share/utils'
import { Page } from '$screen/domain/entities'

import { type Lang, LANGS } from '../const'
import { IDLE_I18N } from '../entities'
import { type II18n } from '../models'
import type { I18nRepo } from '../repositories/i18n.repo'
import { I18nObs } from './i18n-obs.service'

export class I18nSvc implements II18n {
	#page?: PagesKeys | null = null
	readonly #obs = inject(I18nObs)
	readonly #repo

	constructor(repo: I18nRepo) {
		this.#repo = repo
	}

	get data() {
		return this.#obs.data
	}

	async load(page: Page): Promise<void> {
		const lang = await this.#repo.getLang()
		if (lang != null) await this.updateFor({ lang, page })
	}

	async updateFor(screen: RequireOne<{ lang: Lang; page: Page }>) {
		const lang = screen.lang ?? this.#obs.data.lang
		this.#page = option(screen.page, Page.getPageKey)

		if (!inArray(LANGS, lang)) {
			this.#obs.set(IDLE_I18N)
			return
		}
		if (this.#page == null) {
			this.#obs.set({ lang, ns: IDLE_I18N.ns })
			return
		}

		this.#obs.set({ lang, ns: await this.#repo.getNamespaces(lang, this.#page) })
	}
}
