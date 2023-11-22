import type { Position } from '~/share/domain/models'
import { ContextService, Observable, PositionService } from '~/share/domain/services'

export const posObservable = new Observable<Position>()

export const posCtx = new ContextService(posObservable, PositionService.IDLE_POS)
