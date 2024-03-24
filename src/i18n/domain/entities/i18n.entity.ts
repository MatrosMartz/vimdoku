import type { Namespace, NamespaceTextGetter } from '~/locales'

import { IDLE_LANG, type Lang } from '../const'

export interface I18n {
	lang: Lang
	/**
	 * Gets object with .
	 * @param namespace Key of namespace.
	 */
	ns<Ns extends keyof Namespace>(namespace: Ns): NamespaceTextGetter<Namespace[Ns]>
}

const IDLE_I18N_HANDLER = {
	get() {
		return (fallback: string, keywords?: Record<string, string>) => {
			if (keywords != null)
				for (const [keyword, value] of Object.entries(keywords)) fallback = fallback.replaceAll(`{|${keyword}|}`, value)

			return fallback
		}
	},
}

export const IDLE_I18N: I18n = {
	lang: IDLE_LANG,
	ns: () => new Proxy({}, IDLE_I18N_HANDLER) as never,
}
