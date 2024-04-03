import { Observable } from '~/share/domain/entities'
import { singleton } from '~/share/utils'

import { IDLE_SCREEN, type VimScreen } from '../models'

@singleton
export class ScreenObs extends Observable<VimScreen> {
	constructor() {
		super({ ...IDLE_SCREEN })
	}
}
