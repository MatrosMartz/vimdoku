import type { Med } from '$cmd/domain/models'
import { MedSvc } from '$cmd/domain/services'
import { i18n } from '$i18n/infra/services'
import { prefs } from '$pref/infra/services'
import { vimScreen } from '$screen/infra/services'
import { game } from '$sudoku/infra/services'

import { boardObs, boardSavedObs, i18nObs, modeObs, posObs, prefsObs, screenObs, timerObs } from '../stores'

const state: Med.State = {
	board: boardObs,
	boardSaved: boardSavedObs,
	i18n: i18nObs,
	mode: modeObs,
	pos: posObs,
	prefs: prefsObs,
	screen: screenObs,
	timer: timerObs,
}

export const med = new MedSvc({ game, i18n, prefs, screen: vimScreen, state })
