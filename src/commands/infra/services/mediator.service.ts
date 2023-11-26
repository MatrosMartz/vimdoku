import type { Med } from '$cmd/domain/models'
import { MedSvc } from '$cmd/domain/services'
import { prefs } from '$pref/infra/services'
import { vimScreen } from '$screen/infra/services'
import { game } from '$sudoku/infra/services'

import { boardObs, boardSavedObs, modeObs, posObs, prefsObs, screenObs, timerObs } from '../stores'

const state: Med.State = {
	board: boardObs,
	boardSaved: boardSavedObs,
	mode: modeObs,
	pos: posObs,
	prefs: prefsObs,
	screen: screenObs,
	timer: timerObs,
}

export const med = new MedSvc({ game, prefs, screen: vimScreen, state })
