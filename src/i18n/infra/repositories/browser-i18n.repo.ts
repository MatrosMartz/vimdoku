import type { Namespace, NamespaceTextGetter, PagesKeys, ShareLocale } from '~/locales'
import { inArray } from '~/share/utils'
import { type Lang, LANGS } from '$i18n/domain/const'
import { IDLE_I18N_PROXY, IDLE_I18N_TRANSLATE_FN } from '$i18n/domain/entities'
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
	async getNamespaces(lang: Lang, page: PagesKeys) {
		const [localePage, share] = await Promise.all([
			internalFetch<Namespace[PagesKeys]>(page, lang),
			internalFetch<ShareLocale>('share', lang),
		])

		const shareProxy = new Proxy<NamespaceTextGetter<ShareLocale>>({} as never, {
			get(_, prop) {
				if (prop in share)
					return (fallback: string, keywords?: Record<string, string>) => {
						let text = share[prop as keyof ShareLocale]
						if (keywords != null)
							for (const [keyword, value] of Object.entries(keywords)) text = text.replaceAll(`{|${keyword}|}`, value)
						return text
					}
				return IDLE_I18N_TRANSLATE_FN
			},
		})

		const pageHandler = new Proxy<NamespaceTextGetter<Namespace[PagesKeys]>>(
			{},
			{
				get(_, prop) {
					if (prop in localePage)
						return (fallback: string, keywords?: Record<string, string>) => {
							let text = localePage[prop as keyof Namespace[PagesKeys]] as string
							if (keywords != null)
								for (const [keyword, value] of Object.entries(keywords)) text = text.replaceAll(`{|${keyword}|}`, value)
							return text
						}
					return IDLE_I18N_TRANSLATE_FN
				},
			}
		)

		return <K extends keyof Namespace>(localeKey: K) => {
			if (localeKey === 'share') return shareProxy as NamespaceTextGetter<Namespace[K]>
			if (localeKey === page) return pageHandler as NamespaceTextGetter<Namespace[K]>

			return IDLE_I18N_PROXY as NamespaceTextGetter<Namespace[K]>
		}
	},
}
