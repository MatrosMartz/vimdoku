import type { NsFn, PagesKeys } from '~/locales'

import type { Lang } from '../const'

export interface I18nRepo {
	findNamespace(lang: Lang, page: PagesKeys): Promise<NsFn>
	getLang(): Promise<Lang | null>
}
