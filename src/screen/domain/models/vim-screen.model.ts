import type { Lang } from '$pref/domain/models'

import { IDLE_MODAL, IDLE_PAGE, type Modal, type Page } from '../entities'

export interface VimScreen {
	modal: Modal
	page: Page
}

export interface IScreen {
	readonly lang?: Lang
	/** Get the current main screen and dialog. */
	readonly data: VimScreen
	/** Get the current modal. */
	readonly modal: Modal
	/** Get the current main screen. */
	readonly page: Page
	/** Return to previous screen or close dialog. */
	close(): Promise<void>
	/** Set main screen. */
	gotTo(route: Page): Promise<void>
	load(): Promise<void>
	setLang(lang: Lang): Promise<void>
	/** Set dialog and options. */
	setModal(dialog: Modal): void
}

export const IDLE_SCREEN = { modal: IDLE_MODAL, page: IDLE_PAGE } as const satisfies VimScreen
