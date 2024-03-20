import { inArray } from '~/share/utils'
import { LANGS } from '$i18n/domain/const'
import type { I18nRepo } from '$i18n/domain/repositories/i18n.repo'

export const browserI18nRepo: I18nRepo = {
	async get() {
		for (const l of globalThis.navigator.languages) {
			const lang = l.slice(0, 2)

			if (inArray(LANGS, lang)) return lang
		}

		return null
	},
}
