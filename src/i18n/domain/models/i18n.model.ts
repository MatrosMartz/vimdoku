import type { I18n } from '$i18n/domain/entities'
import type { Route } from '$page/domain/entities'

import type { Lang } from '../const'

export interface II18n {
	/** The current data. */
	readonly data: I18n
	clearLang(): this
	/** Changes locales asynchronously. */
	save(): Promise<void>
	setDefaultLanguage(lang?: Lang | null): this
	setLang(lang?: Lang | null): this
	setRoute(route: Route.Route): this
}
