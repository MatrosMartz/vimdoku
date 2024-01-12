import type { NotesData } from './notes.model'

export enum CellKind {
	Correct = 'correct',
	Empty = 'empty',
	Incorrect = 'incorrect',
	Initial = 'initial',
	Unverified = 'unverified',
	WhitNotes = 'notes',
}

export type InsertKinds = CellKind.Correct | CellKind.Incorrect | CellKind.Unverified

export const INSERT_KINDS: InsertKinds[] = [CellKind.Correct, CellKind.Incorrect, CellKind.Unverified]

export interface CellJSON {
	kind: CellKind
	notes: number
	value: number
}

export interface MoveData {
	notes: NotesData
	value: number
}

export interface MoveItem {
	next: MoveData
	prev: MoveData
}

export type MoveMap = Map<`${number}-${number}`, MoveItem>

export const EMPTY_CELL_VALUE = 0
