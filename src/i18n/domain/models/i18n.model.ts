import type { RequireOne } from '~/share/types'
import type { I18n } from '$i18n/domain/entities'
import type { Route } from '$screen/domain/entities'

import type { Lang } from '../const'

export interface II18n {
	/** The current data. */
	readonly data: I18n
	load(route: Route): Promise<void>
	/**
	 * Changes locales asynchronously.
	 * @param screen The new language and/or page.
	 */
	updateFor(screen: RequireOne<{ lang: Lang; route: Route }>): Promise<void>
}
