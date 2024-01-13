import type { Solution, SolutionJSON } from '../entities/solution.entity'
import type { DifficultyKind } from './difficulties.model'

export interface GameOpts {
	/** Number of initials cells */
	difficulty: DifficultyKind
	/** Sudoku solution */
	solution: Solution
}

export interface GameOptsJSON {
	difficulty: DifficultyKind
	solution: SolutionJSON
}

export interface GameInfo {
	errors: number
	timer: number
}
