import { createState } from '~/share/utils/svelte/create-state'

import { screenObs } from '../screen.store'

export const screenState = createState(screenObs)
