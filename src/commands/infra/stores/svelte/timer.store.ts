import { timerObs } from '../timer.store'
import { createState } from './create-state'

export const timerState = createState(timerObs)
