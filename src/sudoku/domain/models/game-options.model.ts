import type { DifficultyKinds } from './difficulties.model'
import type { ISolution, SolutionJSON } from './solution.model'

export interface GameOpts {
	/** Number of initials cells */
	difficulty: DifficultyKinds
	/** Sudoku solution */
	solution: ISolution
}

export interface GameOptsJSON {
	difficulty: DifficultyKinds
	solution: SolutionJSON
}
