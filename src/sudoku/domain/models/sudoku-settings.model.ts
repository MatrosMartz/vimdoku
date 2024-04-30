import type { Difficulty } from '../const'
import type { Solution, SolutionJSON } from '../entities'

export interface SudokuSetts {
	/** Number of initials cells */
	difficulty: Difficulty.Kind
	/** Sudoku solution */
	solution: Solution
}

export interface SudokuSettsJSON {
	difficulty: Difficulty.Kind
	solution: SolutionJSON
}

export interface SudokuInfo {
	errors: number
	timer: number
}
