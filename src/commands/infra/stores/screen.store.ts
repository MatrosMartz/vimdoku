import { Context, Observable } from '~/share/domain/services'
import type { VimScreen } from '$screen/domain/models'
import { ScreenService } from '$screen/domain/services'

export const screenObservable = new Observable<VimScreen>()

export const screenCtx = new Context(screenObservable, ScreenService.DEFAULT_SCREEN)
