import type { I18n } from '$i18n/domain/entities'
import type { RouteBase } from '$screen/domain/entities'

import type { Lang } from '../const'

export interface II18n {
	/** The current data. */
	readonly data: I18n
	clearLang(): this
	/** Changes locales asynchronously. */
	save(): Promise<void>
	setDefaultLanguage(lang: Lang): this
	setLang(lang: Lang): this
	setRoute(route: RouteBase): this
}
