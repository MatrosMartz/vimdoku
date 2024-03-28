import type { Namespace, PagesKeys } from '~/locales'

import type { Lang } from '../const'

export interface I18nRepo {
	getLang(): Promise<Lang | null>
	getLocale<Page extends PagesKeys>(
		lang: Lang,
		page: Page
	): Promise<{ [Ns in Page | Exclude<keyof Namespace, PagesKeys>]: Record<keyof Namespace[Ns], string> }>
}
