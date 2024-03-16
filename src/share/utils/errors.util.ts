export class InvalidBoardError extends Error {
	constructor(Board: unknown, cause?: unknown) {
		super(`Invalid Board: ${JSON.stringify(Board)}`, { cause })
	}
}

export class InvalidSolutionError extends Error {
	constructor(solution: unknown, cause: unknown) {
		super(`Invalid Solution: ${JSON.stringify(solution)}`, { cause })
	}
}

export class InvalidNoteError extends Error {
	constructor(note: unknown, cause?: unknown) {
		super(`Invalid Note: "${JSON.stringify(note)}"`, { cause })
	}
}

export class InvalidPreferencesError extends Error {
	constructor(preferences: unknown, cause?: unknown) {
		super(`Invalid Preferences: "${JSON.stringify(preferences)}"`, { cause })
	}
}

export class LocalStorageEntryMissingError extends Error {
	constructor(entryName: string) {
		super(`Missing Entry: "${entryName}" in localStore`)
	}
}

export class RepoItemNotFoundError extends Error {
	constructor(itemName: string, cause?: unknown) {
		super(`Could not find the requested item: "${itemName}" in the repository`, { cause })
		this.name = 'RepoItemNotFoundError'
	}
}

export class InvalidStringPageError extends Error {}
