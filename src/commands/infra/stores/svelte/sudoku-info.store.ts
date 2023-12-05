import { errorsObs, timerObs } from '../sudoku-info.store'
import { createState } from './create-state'

export const errorsState = createState(errorsObs)
export const timerState = createState(timerObs)
