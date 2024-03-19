import { Observable } from '~/share/domain/entities'
import { singleton } from '~/share/utils'

import { IDLE_MODAL, IDLE_PAGE } from '../entities'
import { type VimScreen } from '../models'

@singleton
export class ScreenObs extends Observable<VimScreen> {
	constructor() {
		super({ modal: IDLE_MODAL, page: IDLE_PAGE })
	}
}
