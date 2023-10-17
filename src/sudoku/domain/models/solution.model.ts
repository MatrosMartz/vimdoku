import type { Tuple } from '~/share/types'

import { type IGrid } from './grid.model'
import type { ValidNumbers } from './notes.model'

export type SolutionGrid = IGrid<ValidNumbers>

export type SolutionJSON = Tuple<Tuple<ValidNumbers, 9>, 9>

export interface ISolution {
	/** Get the current data of Solution. */
	get data(): SolutionJSON
	/** Get the current grid. */
	get grid(): SolutionGrid
	/** Converts the solution instance to a array. */
	toJSON(): SolutionJSON
	/** Converts Solution instance in sudoku board string representation. */
	toString(): string
}
