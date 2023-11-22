import { posCtx, posObservable } from '../position.store'
import { createState } from './create-state'

export const posState = createState(posObservable, posCtx)
