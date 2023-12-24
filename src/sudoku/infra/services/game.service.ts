import { NonStartedGameSvc } from '$sudoku/domain/services/game.service'

import { BrowserGameRepo } from '../repositories'

const repo = new BrowserGameRepo()

export const game = new NonStartedGameSvc(repo)
