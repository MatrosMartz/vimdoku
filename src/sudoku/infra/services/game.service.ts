import type { GameObs } from '$sudoku/domain/models'
import { NonStartedGameSvc } from '$sudoku/domain/services/game.service'

import { BrowserGameRepo } from '../repositories'
import { boardObs, errorsObs, modeObs, posObs, savedObs, timerObs } from '../stores'

const repo = new BrowserGameRepo()

const obs: GameObs = {
	board: boardObs,
	errors: errorsObs,
	mode: modeObs,
	pos: posObs,
	saved: savedObs,
	timer: timerObs,
}

export const game = new NonStartedGameSvc({ obs, repo })
