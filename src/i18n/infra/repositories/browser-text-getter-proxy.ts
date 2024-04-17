import type { LocaleStr, LocaleType, TextGetter } from '~/locales'
import type { Lang } from '$i18n/domain/const'
import { IDLE_I18N_TRANSLATE_FN } from '$i18n/domain/entities'

/**
 * Replaces all the keywords with the assigned value.
 * @param text Original text.
 * @param entries With the keyword-value pair.
 * @returns The text with replaced keywords.
 */
function replaceKeywords(text: string, entries: Array<[string, string]>) {
	for (const [kw, value] of entries) text = text.replaceAll(`{|${kw}|}`, value)
	return text
}

/**
 * Create locale text getter.
 * @param locale Locale.
 * @returns New locale text getter.
 */
function create<Locale extends LocaleType>(locale: LocaleStr<Locale>) {
	type LocaleTextGetter = TextGetter<Locale>
	const proxyHandler: ProxyHandler<LocaleTextGetter> = {
		get(_, prop: string) {
			const text = Reflect.get(locale, prop)

			if (text == null) return IDLE_I18N_TRANSLATE_FN

			if (typeof text !== 'string') return text

			return (fallback: string, keywords: Record<string, string> = {}) =>
				replaceKeywords(text, Object.entries(keywords))
		},
	}
	return new Proxy<LocaleTextGetter>({} as never, proxyHandler)
}

/**
 * Create text getter with fetching locales.
 * @param localeKey The key of locale.
 * @param lang Language of the locale.
 * @returns The text getter.
 */
async function fromLocale<Locale extends LocaleType>(localeKey: string, lang: Lang) {
	const locale = await TextGetterProxy.getLocale<Locale>(localeKey, lang)
	return await new Promise<TextGetter<Locale>>(resolve => resolve(TextGetterProxy.create(locale)))
}

/**
 * Wrapper for fetching locales.
 * @param localeKey The key of locale.
 * @param lang Language of the locale.
 * @returns The locale.
 */
async function getLocale<Locale extends LocaleType>(localeKey: string, lang: Lang) {
	return await fetch(globalThis.location.origin + `/locales/${localeKey}/${lang}.json`).then<LocaleStr<Locale>>(
		async res => await res.json()
	)
}

export const TextGetterProxy = { create, fromLocale, getLocale }
