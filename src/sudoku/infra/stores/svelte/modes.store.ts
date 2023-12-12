import { createState } from '~/share/utils/svelte/create-state'

import { modeObs } from '../modes.store'

export const modeState = createState(modeObs)
