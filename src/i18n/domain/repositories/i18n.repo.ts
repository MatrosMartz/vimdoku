import type { Namespace, NamespaceTextGetter, PagesKeys } from '~/locales'

import type { Lang } from '../const'

export interface I18nRepo {
	getLang(): Promise<Lang | null>
	getNamespaces(
		lang: Lang,
		page: PagesKeys
	): Promise<<K extends keyof Namespace>(localeKey: K) => NamespaceTextGetter<Namespace[K]>>
}
