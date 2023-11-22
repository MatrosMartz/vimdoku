import type { Mediator } from '$cmd/domain/models'
import { MediatorService } from '$cmd/domain/services'
import { preferences } from '$pref/infra/services'
import { vimScreen } from '$screen/infra/services'
import { game } from '$sudoku/infra/services'

import { boardCtx, boardSavedCtx, modeCtx, posCtx, prefCtx, screenCtx, timerCtx } from '../stores'

const state: Mediator.State = {
	board: boardCtx,
	boardSaved: boardSavedCtx,
	mode: modeCtx,
	position: posCtx,
	preferences: prefCtx,
	screen: screenCtx,
	timer: timerCtx,
}

export const mediator = new MediatorService({ game, preferences, screen: vimScreen, state })
