import { prefCtx, prefObservable } from '../preferences.store'
import { createState } from './create-state'

export const prefState = createState(prefObservable, prefCtx)
