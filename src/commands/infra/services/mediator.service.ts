import { MediatorService } from '$cmd/domain/services'
import { preferences } from '$preferences/infra/services'
import { vimScreen } from '$screen/infra/services'
import { game } from '$sudoku/infra/services'

export const mediator = new MediatorService({ game, preferences, screen: vimScreen })
