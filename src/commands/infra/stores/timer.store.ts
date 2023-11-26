import { AsyncContextSvc, Observable } from '~/share/domain/services'
import { TimerSvc } from '$sudoku/domain/services'

export const timerObservable = new Observable<string>()

export const timerCtx = new AsyncContextSvc(timerObservable, TimerSvc.IDLE_TIMER)
