import { inject } from '~/share/utils'
import { createState } from '~/share/utils/svelte/create-state'
import { BoardObs, SavedObs } from '$sudoku/domain/services'

export const boardState = createState(inject(BoardObs))

export const savedState = createState(inject(SavedObs))
