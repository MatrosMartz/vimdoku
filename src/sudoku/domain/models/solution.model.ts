import type { ValidNumbers } from './notes.model'
import { type IGrid } from './grid.model'

export type SolutionData = IGrid<ValidNumbers>

export type SolutionJSON = ValidNumbers[][]

export interface ISolution {
	/** Get the current solution. */
	get data(): SolutionData
	/** Converts th solution instance to a array. */
	toJSON(): SolutionJSON
	toString(): string
}
