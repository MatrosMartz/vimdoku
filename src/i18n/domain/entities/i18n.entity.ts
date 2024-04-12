import type { LocaleType, Namespace, TextGetter } from '~/locales'

import { type Lang } from '../const'

export interface I18n {
	lang?: Lang | null
	/**
	 * Gets object with .
	 * @param localKey Key of namespace.
	 */
	ns<Key extends keyof Namespace>(localKey: Key): TextGetter<Namespace[Key] & LocaleType>
}

/**
 * Idle i18n translate function.
 * @param fallback The alternative text.
 * @param keywords The keywords replace in the text.
 * @returns Fallback with keywords replaced.
 */
export function IDLE_I18N_TRANSLATE_FN(fallback: string, keywords?: Record<string, string>) {
	if (keywords != null)
		for (const [keyword, value] of Object.entries(keywords)) fallback = fallback.replaceAll(`{|${keyword}|}`, value)

	return fallback
}

export const IDLE_I18N_HANDLER = {
	get() {
		return IDLE_I18N_TRANSLATE_FN
	},
}

export const IDLE_I18N_PROXY = new Proxy<TextGetter<LocaleType>>({}, IDLE_I18N_HANDLER)

export const IDLE_I18N: I18n = {
	lang: null,
	ns: () => IDLE_I18N_PROXY as never,
}
