import { modeCtx, modeObservable } from '../modes.store'
import { createState } from './create-state'

export const modeState = createState(modeObservable, modeCtx)
