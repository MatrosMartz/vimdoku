import { boardCtx, boardObservable, boardSavedCtx, boardSavedObservable } from '../sudoku.store'
import { createState } from './create-state'

export const boardState = createState(boardObservable, boardCtx)

export const boardSavedState = createState(boardSavedObservable, boardSavedCtx)
