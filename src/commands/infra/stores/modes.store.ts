import { Context, Observable } from '~/share/domain/services'
import { ModeKinds } from '$sudoku/domain/models'

export const modeObservable = new Observable<ModeKinds>()

export const modeCtx = new Context(modeObservable, ModeKinds.X)