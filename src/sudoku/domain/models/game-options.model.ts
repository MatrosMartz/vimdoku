import type { Solution } from '../entities/solution.entity'
import type { DifficultyKind } from './difficulties.model'
import type { SolutionJSON } from './solution.model'

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
