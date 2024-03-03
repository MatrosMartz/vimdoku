import { inject } from '~/share/utils'
import { IDLE_PREFS, type Lang } from '$pref/domain/models'

import { type I18nKeys, type I18nSchema } from '../entities'
import { type II18n } from '../models'
import { I18nObs } from './i18n-obs.service'

export class I18nSvc implements II18n {
	#actualLang: Lang = IDLE_PREFS.language
	readonly #obs = inject(I18nObs)

	get actualLang() {
		return this.#actualLang
	}

	get data() {
		return this.#obs.data
	}

	async changeLang(lang: Lang) {
		this.#actualLang = lang
		const resource = await this.#fetchResource(lang)

		this.#obs.set({
			get: (key, fallBack) => this.#getText(key, resource) ?? fallBack,
			getTemplate: (key, fallback, value) => {
				const head = this.#getText(`${key}-head`, resource) ?? fallback.head
				const tail = this.#getText(`${key}-tail`, resource) ?? fallback.tail

				return head + value + tail
			},
		})
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
}
