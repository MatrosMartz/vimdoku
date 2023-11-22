import { AsyncContext, Observable } from '~/share/domain/services'
import { TimerService } from '$sudoku/domain/services'

export const timerObservable = new Observable<string>()

export const timerCtx = new AsyncContext(timerObservable, TimerService.IDLE_TIMER)
