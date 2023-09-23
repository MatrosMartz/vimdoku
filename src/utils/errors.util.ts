export class InvalidBoardError extends Error {
	constructor(Board: unknown) {
		super(`Invalid Board: ${JSON.stringify(Board)}`)
	}
}
export class InvalidSolutionError extends Error {
	constructor(solution: unknown) {
		super(`Invalid Solution: ${JSON.stringify(solution)}`)
	}
}
export class InvalidNoteError extends Error {
	constructor(note: unknown) {
		super(`Invalid Note: "${JSON.stringify(note)}"`)
	}
}
export class InvalidPreferencesError extends Error {
	constructor(preferences: unknown) {
		super(`Invalid Preferences: ${JSON.stringify(preferences)}`)
	}
}

export class LocalStorageEntryMissingError extends Error {
	constructor(entryName: string) {
		super(`Missing Entry: "${entryName}" in localStore`)
	}
}
