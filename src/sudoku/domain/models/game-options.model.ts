import type { DifficultyKind } from './difficulties.model'
import type { ISolution, SolutionJSON } from './solution.model'

export interface GameOpts {
	/** Number of initials cells */
	difficulty: DifficultyKind
	/** Sudoku solution */
	solution: ISolution
}

export interface GameOptsJSON {
	difficulty: DifficultyKind
	solution: SolutionJSON
}

export interface GameInfo {
	errors: number
	timer: number
}
