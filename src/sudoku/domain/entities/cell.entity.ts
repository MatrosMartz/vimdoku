import type { INotes, NoteNumbers } from './notes.entity'

export enum CellKinds {
	Correct = 'correct',
	Incorrect = 'incorrect',
	Initial = 'initial',
	Empty = 'empty',
	WhitNotes = 'notes',
}

export interface CellValue {
	kind: CellKinds
	notes: INotes
	value: number
}

export interface CellJSON {
	kind: CellKinds
	notes: NoteNumbers[]
	value: number
}

export interface ICell {
	/** Convert Notes instance in JSON. */
	toJSON(): CellJSON
	/** Convert the Notes instance to a string. */
	toString(): string
	/** Get the current set of notes. */
	get value(): CellValue
}
