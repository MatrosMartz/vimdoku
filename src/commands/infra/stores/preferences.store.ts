import { AsyncContext, Observable } from '~/share/domain/services'
import type { Preferences } from '$pref/domain/models'
import { PreferencesService } from '$pref/domain/services'

export const prefObservable = new Observable<Preferences>()

export const prefCtx = new AsyncContext(prefObservable, PreferencesService.DEFAULT_DATA)
