import { prefsCtx, prefsObservable } from '../preferences.store'
import { createState } from './create-state'

export const prefsState = createState(prefsObservable, prefsCtx)
