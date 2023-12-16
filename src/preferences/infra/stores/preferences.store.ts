import { ObsSvc } from '~/share/domain/services'
import type { Prefs } from '$pref/domain/models'
import { PrefsSvc } from '$pref/domain/services'

export const prefsObs = new ObsSvc<Prefs>(PrefsSvc.DEFAULT)
