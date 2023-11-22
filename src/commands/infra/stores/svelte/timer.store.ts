import { timerCtx, timerObservable } from '../timer.store'
import { createState } from './create-state'

export const timerState = createState(timerObservable, timerCtx)
