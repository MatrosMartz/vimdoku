import { Observable } from '~/share/domain/entities'
import { Comparation, singleton } from '~/share/utils'

import { IDLE_PREFS, type Prefs } from '../models'

@singleton
export class PrefsObs extends Observable<Prefs> {
	constructor() {
		super({ ...IDLE_PREFS }, Comparation.deepEquals)
	}
}
