import { Observable } from '~/share/domain/entities'
import { singleton } from '~/share/utils'

import { IDLE_PREFS, type Prefs } from '../models'

@singleton
export class PrefsObs extends Observable<Prefs> {
	constructor() {
		super({ ...IDLE_PREFS })
	}
}
