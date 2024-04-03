import type { DifficultyKind } from '../const'
import type { Solution, SolutionJSON } from '../entities'

export interface SudokuSetts {
	/** Number of initials cells */
	difficulty: DifficultyKind
	/** Sudoku solution */
	solution: Solution
}

export interface SudokuSettsJSON {
	difficulty: DifficultyKind
	solution: SolutionJSON
}

export interface SudokuInfo {
	errors: number
	timer: number
}
