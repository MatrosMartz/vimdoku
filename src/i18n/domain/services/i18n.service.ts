import { inject } from '~/share/utils'
import { IDLE_PREFS, type Lang } from '$pref/domain/models'

import { type I18nKeys, type I18nSchema, type I18nValue, IDLE_I18N, type II18n } from '../models'
import { I18nObs } from './i18n-obs.service'

export class I18nSvc implements II18n {
	#actualLang: Lang = IDLE_PREFS.language
	#data = IDLE_I18N
	readonly #obs = inject(I18nObs)

	get actualLang() {
		return this.#actualLang
	}

	get data() {
		return this.#data
	}

	async changeLang(lang: Lang) {
		this.#actualLang = lang
		const data = await this.#fetchData(lang)

		const getData = this.#getData

		this.#data = {
			get(key, fallBack) {
				return getData(key, data) ?? fallBack
			},
		}
		this.#obs.set(this.#data)
	}

	async #fetchData(lang: Lang) {
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
