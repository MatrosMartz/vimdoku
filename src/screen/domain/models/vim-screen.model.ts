import type { Lang } from '$i18n/domain/const'

import { IDLE_MODAL, IDLE_ROUTE, type Modal, type RouteBase } from '../entities'

export interface VimScreen {
	modal: Modal
	route: RouteBase
}

export interface IScreen {
	readonly lang?: Lang
	/** Get the current main screen and dialog. */
	readonly data: VimScreen
	/** Return to previous screen or close dialog. */
	close(): this
	save(): Promise<void>
	setLang(lang?: Lang): this
	/** Set dialog and options. */
	setModal(dialog: Modal): this
	/** Set route. */
	setRoute(route: RouteBase): this
}

export const IDLE_SCREEN = { modal: IDLE_MODAL, route: IDLE_ROUTE } as const satisfies VimScreen
