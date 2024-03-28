import type { GameLocale, HomeLocale, ShareLocale } from '~/locales'
import type { MainHelpLocale } from '~/locales/pages/help/main.locale'
import type { ShareHelpLocale } from '~/locales/pages/help/share.locale'
import { inArray } from '~/share/utils'
import { type Lang, LANGS } from '$i18n/domain/const'
import type { I18nRepo } from '$i18n/domain/repositories/i18n.repo'

/**
 * Wrapper for fetching locales.
 * @param localeKey The key of locale.
 * @param lang Language of the locale.
 * @returns The locale.
 */
async function internalFetch<O>(localeKey: string, lang: Lang) {
	return await fetch(globalThis.location.origin + `/locales/${localeKey}/${lang}.json`).then<Record<keyof O, string>>(
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
		const [game, helpMain, helpShare, home, share] = await Promise.all([
			internalFetch<GameLocale>('pages/game', lang),
			internalFetch<MainHelpLocale>('pages/help/main', lang),
			internalFetch<ShareHelpLocale>('pages/help/share', lang),
			internalFetch<HomeLocale>('pages/home', lang),
			internalFetch<ShareLocale>('share', lang),
		])

		return { 'pages/game': game, 'pages/help/main': helpMain, 'pages/help/share': helpShare, 'pages/home': home, share }
	},
}
