import { inject } from '~/share/utils'
import { createDerived, createState } from '~/share/utils/svelte/create-state'
import { BoardObs, SavedObs } from '$sudoku/domain/services'

export const boardState = createDerived(inject(BoardObs), board => board?.data)

export const savedState = createState(inject(SavedObs))
