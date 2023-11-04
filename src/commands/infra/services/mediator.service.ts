import { MediatorService } from '$cmd/domain/services'
import { preferences } from '$pref/infra/services'
import { vimScreen } from '$screen/infra/services'
import { game } from '$sudoku/infra/services'

export const mediator = new MediatorService({ game, preferences, screen: vimScreen })
