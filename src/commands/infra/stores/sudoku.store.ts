import { AsyncObsSvc } from '~/share/domain/services'
import type { Board } from '$sudoku/domain/models'

export const boardObs = new AsyncObsSvc<Board | null>(null)

export const boardSavedObs = new AsyncObsSvc(false)
