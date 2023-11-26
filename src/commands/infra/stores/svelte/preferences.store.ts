import { prefsObs } from '../preferences.store'
import { createState } from './create-state'

export const prefsState = createState(prefsObs)
