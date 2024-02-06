import { SudokuSvc } from '$sudoku/domain/services'

import { BrowserSudokuRepo } from '../repositories'

const repo = new BrowserSudokuRepo()

export const sudoku = new SudokuSvc({ repo })
