import { AsyncObsSvc } from '~/share/domain/services'
import { TimerSvc } from '$sudoku/domain/services'

export const timerObs = new AsyncObsSvc(TimerSvc.IDLE_TIMER)
