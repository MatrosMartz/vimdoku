import { inArray, inject } from '~/share/utils'

import { type Lang, LANGS } from '../const'
import { type I18nKeys, type I18nSchema, IDLE_I18N } from '../entities'
import { type II18n } from '../models'
import type { I18nRepo } from '../repositories/i18n.repo'
import { I18nObs } from './i18n-obs.service'

export class I18nSvc implements II18n {
	readonly #obs = inject(I18nObs)
	readonly #repo

	constructor(repo: I18nRepo) {
		this.#repo = repo
	}

	get data() {
		return this.#obs.data
	}

	async changeLang(lang: Lang) {
		if (!inArray(LANGS, lang)) {
			this.#obs.set(IDLE_I18N)
			return
		}
		const resource = await this.#fetchResource(lang)

		this.#obs.set({
			lang,
			get: (key, fallBack, keywords) => this.#replaceKeywords(this.#getText(key, resource) ?? fallBack, keywords),
		})
	}

	async load() {
		const lang = await this.#repo.get()
		if (lang != null) await this.changeLang(lang)
	}

	/**
	 * The fetch language resource.
	 * @param lang The language.
	 * @returns The resource.
	 */
	async #fetchResource(lang: Lang) {
		return await fetch(globalThis.location.origin + `/locales/${lang}.json`).then<I18nSchema | null>(
			async res => await res.json()
		)
	}

	/**
	 * Find text in the resource.
	 * @param key The key of the text.
	 * @param resource The resource in the find text.
	 * @returns The text or null if was not exist in the resource.
	 */
	#getText<K extends I18nKeys>(key: K, resource: I18nSchema | null): string | null {
		if (resource == null) return null

		let result: any = resource

		for (const k of key.split('-')) {
			result = result[k]
			if (result == null) return null
		}

		return result
	}

	#replaceKeywords(text: string, keywords?: Record<string, string>) {
		if (keywords == null) return text

		for (const [keyword, value] of Object.entries(keywords))
			if (value != null || typeof value !== 'object') text = text.replaceAll(`{|${keyword}|}`, value)
		return text
	}
}
