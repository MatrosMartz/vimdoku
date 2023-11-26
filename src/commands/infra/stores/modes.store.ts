import { ObsSvc } from '~/share/domain/services'
import { ModeKinds } from '$sudoku/domain/models'

export const modeObs = new ObsSvc(ModeKinds.X)
