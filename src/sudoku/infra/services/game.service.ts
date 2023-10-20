import { NonStartedGameService } from '$sudoku/domain/services/game.service'

import { BrowserGameRepo } from '../repositories'

export const game = new NonStartedGameService(new BrowserGameRepo())
