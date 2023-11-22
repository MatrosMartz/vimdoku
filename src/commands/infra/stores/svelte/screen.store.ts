import { screenCtx, screenObservable } from '../screen.store'
import { createState } from './create-state'

export const screenState = createState(screenObservable, screenCtx)
