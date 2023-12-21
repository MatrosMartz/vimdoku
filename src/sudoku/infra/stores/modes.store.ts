import { ObsSvc } from '~/share/domain/services'
import { ModeKind } from '$sudoku/domain/models'

export const modeObs = new ObsSvc(ModeKind.X)
