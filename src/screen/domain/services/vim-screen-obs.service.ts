import { Observable } from '~/share/domain/entities'
import { singleton } from '~/share/utils'

import { IDLE_MODAL, IDLE_ROUTE } from '../entities'
import { type VimScreen } from '../models'

@singleton
export class ScreenObs extends Observable<VimScreen> {
	constructor() {
		super({ modal: IDLE_MODAL, route: IDLE_ROUTE })
	}

	set(data: VimScreen): this {
		console.log(data)
		super.set(data)
		return this
	}
}
