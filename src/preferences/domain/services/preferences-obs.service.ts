import { ObsSvc } from '~/share/domain/services'
import { singleton } from '~/share/utils'

import { IDLE_PREFS, type Prefs } from '../models'

@singleton
export class PrefsObs extends ObsSvc<Prefs> {
	constructor() {
		super({ ...IDLE_PREFS })
	}
}
