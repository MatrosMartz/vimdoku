import { AsyncObsSvc } from '~/share/domain/services'
import { TimerSvc } from '$sudoku/domain/services'

export const errorsObs = new AsyncObsSvc(0)
export const timerObs = new AsyncObsSvc(TimerSvc.IDLE_STR)
