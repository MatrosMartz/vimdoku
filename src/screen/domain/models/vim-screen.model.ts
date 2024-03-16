import type { Lang } from '$pref/domain/models'

import { IDLE_MODAL, IDLE_ROUTE, type ModalEntity, type Page } from '../entities'

export interface VimScreen {
	modal: ModalEntity
	route: Page
}

export interface IScreen {
	readonly lang?: Lang
	/** Get the current main screen and dialog. */
	readonly data: VimScreen
	/** Get the current modal. */
	readonly modal: ModalEntity
	/** Get the current main screen. */
	readonly route: Page
	/** Return to previous screen or close dialog. */
	close(): void
	/** Set main screen. */
	gotTo(route: Page): void
	setLang(lang: Lang): void
	/** Set dialog and options. */
	setModal(dialog: ModalEntity): void
}

export const IDLE_SCREEN = { modal: IDLE_MODAL, route: IDLE_ROUTE } as const satisfies VimScreen
