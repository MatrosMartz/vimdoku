import { createState } from '~/share/utils/svelte/create-state'

import { errorsObs, timerObs } from '../sudoku-info.store'

export const errorsState = createState(errorsObs)
export const timerState = createState(timerObs)
