import type { DifficultyKinds } from './difficulties.model'
import type { ISolution } from './solution.model'

export interface BoardOpts {
	/** Number of initials cells */
	difficulty: DifficultyKinds
	/** Sudoku solution */
	solution: ISolution
}
