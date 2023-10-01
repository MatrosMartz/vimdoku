import type { DifficultyKinds } from './difficulties.model'
import type { ValidNumbers } from './notes.model'
import type { ISolution } from './solution.model'

export interface GameOpts {
	/** Number of initials cells */
	difficulty: DifficultyKinds
	/** Sudoku solution */
	solution: ISolution
}

export interface GameOptsJSON {
	difficulty: DifficultyKinds
	solution: ValidNumbers[][]
}
