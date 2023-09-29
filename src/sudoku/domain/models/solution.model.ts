import { type IGrid } from './grid.model'
import type { ValidNumbers } from './notes.model'

export type SolutionGrid = IGrid<ValidNumbers>

export type SolutionJSON = ValidNumbers[][]

export interface ISolution {
	/** Get the current grid. */
	get grid(): SolutionGrid
	/** Converts the solution instance to a array. */
	toJSON(): SolutionJSON
	/** Converts Solution instance in sudoku board string representation. */
	toString(): string
	/** Get the current value Solution. */
	get value(): SolutionJSON
}
