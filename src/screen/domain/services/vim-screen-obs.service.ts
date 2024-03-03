import { Observable } from '~/share/domain/entities'
import { singleton } from '~/share/utils'

import { IDLE_ROUTE } from '../entities'
import { IDLE_DIALOG, type VimScreen } from '../models'

@singleton
export class ScreenObs extends Observable<VimScreen> {
	constructor() {
		super({ dialog: { ...IDLE_DIALOG }, route: IDLE_ROUTE })
	}
}
