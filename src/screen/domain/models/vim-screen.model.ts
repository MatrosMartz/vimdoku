import type { Lang } from '$pref/domain/models'

import { IDLE_ROUTE, type Route } from '../entities'
import { type DialogData, IDLE_DIALOG } from './dialog.model'

export interface VimScreen {
	dialog: DialogData
	route: Route
}

export interface IScreen {
	readonly lang?: Lang
	/** Get the current main screen and dialog. */
	readonly data: VimScreen
	/** Get the current dialog. */
	readonly dialog: DialogData
	/** Get the current main screen. */
	readonly route: Route
	/** Return to previous screen or close dialog. */
	close(): void
	/** Set main screen. */
	gotTo(route: Route): void
	/** Set dialog and options. */
	setDialog(dialog: DialogData): void
	setLang(lang: Lang): void
}

export const IDLE_SCREEN = { dialog: IDLE_DIALOG, route: IDLE_ROUTE } as const satisfies VimScreen
