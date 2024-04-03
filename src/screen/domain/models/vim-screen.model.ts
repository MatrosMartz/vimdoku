import type { Lang } from '$i18n/domain/const'

import { IDLE_MODAL, IDLE_ROUTE, type Modal, type Route } from '../entities'

export interface VimScreen {
	modal: Modal
	route: Route
}

export interface IScreen {
	readonly lang?: Lang
	/** Get the current main screen and dialog. */
	readonly data: VimScreen
	/** Get the current modal. */
	readonly modal: Modal
	/** Get the current main screen. */
	readonly route: Route
	/** Return to previous screen or close dialog. */
	close(): Promise<void>
	/** Set main screen. */
	gotTo(route: Route): Promise<void>
	load(): Promise<void>
	setLang(lang: Lang): Promise<void>
	/** Set dialog and options. */
	setModal(dialog: Modal): void
	unload(): Promise<void>
}

export const IDLE_SCREEN = { modal: IDLE_MODAL, route: IDLE_ROUTE } as const satisfies VimScreen
