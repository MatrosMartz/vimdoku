import { boardObs, boardSavedObs } from '../sudoku.store'
import { createState } from './create-state'

export const boardState = createState(boardObs)

export const boardSavedState = createState(boardSavedObs)
