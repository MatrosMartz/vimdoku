import type { Position } from '~/share/domain/models'
import { Context, Observable, PositionService } from '~/share/domain/services'

export const posObservable = new Observable<Position>()

export const posCtx = new Context(posObservable, PositionService.IDLE_POS)
