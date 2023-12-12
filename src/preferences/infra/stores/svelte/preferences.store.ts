import { createState } from '~/share/utils/svelte/create-state'

import { prefsObs } from '../preferences.store'

export const prefsState = createState(prefsObs)
