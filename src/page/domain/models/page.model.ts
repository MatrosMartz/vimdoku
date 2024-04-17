import type { Lang } from '$i18n/domain/const'

import { type Modal, type Page, type Route } from '../entities'

export interface IPage {
	readonly data: Page.Page
	back(): Promise<void>
	save(): Promise<void>
	setLang(lang: Lang | undefined): this
	/** Set modal. */
	setModal(modal: Modal.Modal): this
	/** Set route. */
	setRoute(route: Route.Route): this
}
