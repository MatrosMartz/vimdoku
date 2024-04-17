import type { PagesKeys } from '~/locales'
import { type Lang, LANGS } from '$i18n/domain/const'
import { IDLE_I18N_PROXY } from '$i18n/domain/entities'
import type { I18nRepo } from '$i18n/domain/repositories'

import { TextGetterProxy } from './browser-text-getter-proxy'

export const browserI18nRepo: I18nRepo = {
	async findNamespace(lang: Lang, pageKey: PagesKeys) {
		const [pageLocale, shareLocale] = await Promise.all([
			TextGetterProxy.fromLocale(pageKey, lang),
			TextGetterProxy.fromLocale('share', lang),
		])

		const textGetters = { share: shareLocale, [pageKey]: pageLocale }

		return localeKey => (textGetters[localeKey] ?? IDLE_I18N_PROXY) as never
	},
	async getLang() {
		for (const l of globalThis.navigator.languages) {
			const lang = l.slice(0, 2)

			if (LANGS.contains(lang)) return lang
		}

		return null
	},
}
