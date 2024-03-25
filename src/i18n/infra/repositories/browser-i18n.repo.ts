import { inArray } from '~/share/utils'
import { LANGS, Lang } from '$i18n/domain/const'
import type { I18nRepo } from '$i18n/domain/repositories/i18n.repo'
import type { GameLocale, HomeLocale, ShareLocale } from '~/locales'

async function internalFetch<O>(namespace: string, lang: Lang) {
	return await fetch(globalThis.location.origin + `/locales/${namespace}/${lang}.json`).then<Record<keyof O, string>>(
		async res => await res.json()
	)
}

export const browserI18nRepo: I18nRepo = {
	async getLang() {
		for (const l of globalThis.navigator.languages) {
			const lang = l.slice(0, 2)

			if (inArray(LANGS, lang)) return lang
		}

		return null
	},
	async getLocale(lang) {
		const [game, home, share] = await Promise.all([
			internalFetch<GameLocale>('page/game', lang),
			internalFetch<HomeLocale>('page/home', lang),
			internalFetch<ShareLocale>('share', lang),
		])

		return { 'pages/game': game, 'pages/home': home, share }
	},
}
