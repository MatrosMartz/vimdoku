import { ObsSvc } from '~/share/domain/services'
import type { Board } from '$sudoku/domain/models'

export const boardObs = new ObsSvc<Board | null>(null)

export const savedObs = new ObsSvc(false)
