import { ContextSvc, Observable } from '~/share/domain/services'
import type { VimScreen } from '$screen/domain/models'
import { ScreenSvc } from '$screen/domain/services'

export const screenObservable = new Observable<VimScreen>()

export const screenCtx = new ContextSvc(screenObservable, ScreenSvc.DEFAULT_SCREEN)
