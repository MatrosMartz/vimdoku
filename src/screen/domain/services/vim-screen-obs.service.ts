import { ObsSvc } from '~/share/domain/services'
import { singleton } from '~/share/utils'

import { IDLE_DIALOG, IDLE_MAIN_SCREEN, type VimScreen } from '../models'

@singleton
export class ScreenObs extends ObsSvc<VimScreen> {
	constructor() {
		super({ dialog: { ...IDLE_DIALOG }, main: IDLE_MAIN_SCREEN })
	}
}
