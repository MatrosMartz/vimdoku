import type { I18n } from '$i18n/domain/entities'

import type { Lang } from '../const'

export interface II18n {
	/** The current data. */
	readonly data: I18n
	/**
	 * Changes languages asynchronously.
	 * @param lang The new language.
	 */
	changeLang(lang: Lang): Promise<void>
	load(): Promise<void>
}
