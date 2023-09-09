import type { Position, SolutionValue } from '~/sudoku/domain/models'

export type SolutionErrorType = 'row' | 'col' | 'box' | 'range'

export class InvalidSolutionError extends Error {
	constructor({ pos, solution, type }: { pos: Position; solution: SolutionValue; type: SolutionErrorType }) {
		super(`${solution.toString()}\nIs Invalid for "${type}" Solution in: ${JSON.stringify(pos)}`)
	}
}

export class InvalidNoteError extends Error {
	constructor(note: unknown) {
		super(`"${String(note)}" Is Invalid for note`)
	}
}

export class InvalidLikeError extends Error {
	constructor(like: string, type: unknown) {
		super(`"type: ${String(type)}" Is invalid for ${like} like`)
	}
}
