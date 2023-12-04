import { Langs } from '$pref/domain/models'

import type { I18nData, I18nKeys, I18nSchema, I18nValue, II18n } from '../models'

export class I18nSvc implements II18n {
	#actualLang = Langs.EN
	#data: I18nData = {
		get(key, fallBack) {
			return fallBack
		},
	}

	get actualLang() {
		return this.#actualLang
	}

	get data() {
		return this.#data
	}

	async changeLang(lang: Langs) {
		this.#actualLang = lang
		const data = await this.#fetchData(lang)

		const getData = this.#getData

		this.#data = {
			get(key, fallBack) {
				return getData(key, data) ?? fallBack
			},
		}
	}

	async #fetchData(lang: Langs) {
		return await fetch(`locales/${lang}.json`).then<I18nSchema | null>(async res => await res.json())
	}

	#getData<K extends I18nKeys>(key: K, data: I18nSchema | null): I18nValue<K> | null {
		let result: any = data

		for (const k of key.split('-')) {
			result = result[k]
			if (result === undefined) return null
		}

		return result
	}
}