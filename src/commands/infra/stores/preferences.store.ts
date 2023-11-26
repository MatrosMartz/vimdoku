import { AsyncObsSvc } from '~/share/domain/services'
import { PrefsSvc } from '$pref/domain/services'

export const prefsObs = new AsyncObsSvc(PrefsSvc.DEFAULT_DATA)
