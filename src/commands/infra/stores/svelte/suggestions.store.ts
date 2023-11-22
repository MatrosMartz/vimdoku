import { suggsCtx, suggsObservable } from '../suggestions.store'
import { createState } from './create-state'

export const suggsState = createState(suggsObservable, suggsCtx)
