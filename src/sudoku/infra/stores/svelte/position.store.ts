import { createState } from '~/share/utils/svelte/create-state'

import { posObs } from '../position.store'

export const posState = createState(posObs)
