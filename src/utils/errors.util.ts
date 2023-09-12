import type { Position, SolutionValue } from '~/sudoku/domain/models'

export type SolutionErrorType = 'row' | 'col' | 'box' | 'range'

export class InvalidSolutionError extends Error {
	constructor({ pos, solution, type }: { pos: Position; solution: SolutionValue; type: SolutionErrorType }) {
		super(`Invalid Solution "${type}" in: ${JSON.stringify(pos)}\n${solution.toString()}`)
	}
}

export class InvalidNoteError extends Error {
	constructor(note: unknown) {
		super(`Invalid Note: "${String(note)}"`)
	}
}

export class InvalidPreferencesError extends Error {
	constructor(type: 'sudoku' | 'user' | 'vim') {
		super(`The ${type} preference is invalid`)
	}
}

export class InvalidLikeError extends TypeError {
	constructor(like: string, type: unknown) {
		super(`Invalid Type: "${String(type)}" for ${like} like`)
	}
}

export class LocalStorageEntryMissingError extends Error {
	constructor(entryName: string) {
		super(`Missing Entry: "${entryName}" in localStore`)
	}
}
