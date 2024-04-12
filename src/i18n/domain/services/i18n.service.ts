import type { NsFn, PagesKeys } from '~/locales'
import { inject } from '~/share/utils'
import { RouteBase } from '$screen/domain/entities'

import { type Lang, LANGS } from '../const'
import { type I18n, IDLE_I18N } from '../entities'
import { type II18n } from '../models'
import type { I18nRepo } from '../repositories'
import { I18nObs } from './i18n-obs.service'

export class I18nSvc implements II18n {
	#defaultLang?: Lang | null = null
	#lang?: Lang | null = null
	#page?: PagesKeys | null = null
	readonly #findNamespace
	readonly #obs = inject(I18nObs)

	constructor(findNamespace: (lang: Lang, page: PagesKeys) => Promise<NsFn>) {
		this.#findNamespace = findNamespace
	}

	get data() {
		return this.#obs.data
	}

	static create(repo: I18nRepo) {
		return new I18nSvc(repo.findNamespace)
	}

	clearLang() {
		this.#lang = null
		return this
	}

	async save() {
		const data = await this.#getData()

		if (data != null) this.#obs.set(data)
	}

	setDefaultLanguage(lang: Lang) {
		this.#defaultLang = lang
		if (lang != null && !LANGS.contains(lang)) throw new Error(`language is invalid: "${JSON.stringify(lang)}"`)
		return this
	}

	setLang(lang: Lang) {
		if (lang != null && !LANGS.contains(lang)) throw new Error(`language is invalid: "${JSON.stringify(lang)}"`)
		this.#lang = lang
		return this
	}

	setRoute(route: RouteBase): this {
		if (!RouteBase.isRoute(route)) throw new Error(`route is invalid: "${JSON.stringify(route)}"`)
		this.#page = RouteBase.getPageKey(route)

		return this
	}

	async #getData() {
		let data: I18n | null = null

		if (this.#page == null) {
			if (this.#lang == null && this.#defaultLang != null) data = { lang: this.#defaultLang, ns: IDLE_I18N.ns }
			else data = { lang: this.#lang, ns: IDLE_I18N.ns }
		} else if (this.#defaultLang != null) {
			data = { lang: this.#defaultLang, ns: await this.#findNamespace(this.#defaultLang, this.#page) }
		} else if (this.#lang !== this.#obs.data.lang) {
			if (this.#lang != null) data = { lang: this.#lang, ns: await this.#findNamespace(this.#lang, this.#page) }
		}

		return data
	}
}
