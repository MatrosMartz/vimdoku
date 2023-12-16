import { ObsSvc } from '~/share/domain/services'
import { TimerSvc } from '$sudoku/domain/services'

export const errorsObs = new ObsSvc(0)
export const timerObs = new ObsSvc(TimerSvc.IDLE_STR)
