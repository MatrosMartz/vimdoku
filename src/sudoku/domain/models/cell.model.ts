import type { Notes } from '../entities/notes.entity'

export enum CellKinds {
	Correct = 'correct',
	Incorrect = 'incorrect',
	Initial = 'initial',
	Empty = 'empty',
	WhitNotes = 'notes',
}

export interface Cell {
	kind: CellKinds
	notes: Notes
	value: number
}
