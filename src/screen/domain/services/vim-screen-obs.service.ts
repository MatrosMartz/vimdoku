import { ObsSvc } from '~/share/domain/services'
import { singleton } from '~/share/utils'

import { IDLE_SCREEN, type VimScreen } from '../models'

@singleton
export class ScreenObs extends ObsSvc<VimScreen> {
	constructor() {
		super(IDLE_SCREEN)
	}
}
