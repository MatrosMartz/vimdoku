import { modeObs } from '../modes.store'
import { createState } from './create-state'

export const modeState = createState(modeObs)
