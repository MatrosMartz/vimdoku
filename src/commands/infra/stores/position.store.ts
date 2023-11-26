import type { Pos } from '~/share/domain/models'
import { ContextSvc, Observable, PosSvc } from '~/share/domain/services'

export const posObservable = new Observable<Pos>()

export const posCtx = new ContextSvc(posObservable, PosSvc.IDLE_POS)
