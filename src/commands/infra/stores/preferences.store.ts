import { AsyncContextSvc, Observable } from '~/share/domain/services'
import type { Prefs } from '$pref/domain/models'
import { PrefsSvc } from '$pref/domain/services'

export const prefsObservable = new Observable<Prefs>()

export const prefsCtx = new AsyncContextSvc(prefsObservable, PrefsSvc.DEFAULT_DATA)
