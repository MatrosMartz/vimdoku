import { NonStartedGameSvc } from '$sudoku/domain/services/game.service'

import { BrowserGameRepo } from '../repositories'

export const game = new NonStartedGameSvc(new BrowserGameRepo())
