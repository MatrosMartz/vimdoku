import type { Mediator } from '$cmd/domain/models'
import { MediatorSvc } from '$cmd/domain/services'
import { prefs } from '$pref/infra/services'
import { vimScreen } from '$screen/infra/services'
import { game } from '$sudoku/infra/services'

import { boardCtx, boardSavedCtx, modeCtx, posCtx, prefsCtx, screenCtx, timerCtx } from '../stores'

const state: Mediator.State = {
	board: boardCtx,
	boardSaved: boardSavedCtx,
	mode: modeCtx,
	position: posCtx,
	preferences: prefsCtx,
	screen: screenCtx,
	timer: timerCtx,
}

export const mediator = new MediatorSvc({ game, preferences: prefs, screen: vimScreen, state })
