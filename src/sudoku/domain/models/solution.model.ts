import { type IGrid } from './grid.model'
import type { ValidNumbers } from './notes.model'

export type SolutionGrid = IGrid<ValidNumbers>

export type SolutionJSON = ValidNumbers[][]

export interface ISolution {
	/** Get the current Solution. */
	get data(): SolutionJSON
	/** Get the current grid. */
	get grid(): SolutionGrid
	/** Converts th solution instance to a array. */
	toJSON(): SolutionJSON
	toString(): string
}
