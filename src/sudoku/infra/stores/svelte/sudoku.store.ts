import { createState } from '~/share/utils/svelte/create-state'

import { boardObs, savedObs } from '../sudoku.store'

export const boardState = createState(boardObs)

export const savedState = createState(savedObs)
