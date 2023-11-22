import { AsyncContextService, Observable } from '~/share/domain/services'
import type { Board } from '$sudoku/domain/models'

export const boardObservable = new Observable<Board | null>()

export const boardCtx = new AsyncContextService(boardObservable, null)

export const boardSavedObservable = new Observable<boolean>()

export const boardSavedCtx = new AsyncContextService(boardSavedObservable, false)
