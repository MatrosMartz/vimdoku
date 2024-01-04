import { randomUUID } from 'node:crypto'

import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import { IDLE_POS } from '~/share/domain/models'
import { noop } from '~/share/utils'

import { CellKind, EMPTY_CELL_VALUE, EMPTY_NOTES, type ICell } from '../models'
import { type CellCreateOpts, CellSvc } from './cell.service'

export const DEFAULT_OPTS: CellCreateOpts = { isInitial: false, pos: IDLE_POS, solution: 8 }

beforeAll(() => {
	const crypto = { randomUUID }

	vi.stubGlobal('crypto', crypto)
	return () => vi.unstubAllGlobals()
})

let cell: ICell

describe.concurrent('Initial Cell Svc', () => {
	beforeEach(() => {
		cell = CellSvc.create({ ...DEFAULT_OPTS, isInitial: true })
	})

	test('Should create an initial cell.', () => {
		expect(cell.kind).toBe(CellKind.Initial)
		expect(cell.value).toBe(DEFAULT_OPTS.solution)
		expect(cell.notes).toEqual(EMPTY_NOTES)
	})

	test('Should not be added notes.', () => {
		const cellAfterAddNote = cell.addNote(5)

		expect(cell.id).toBe(cellAfterAddNote.id)
		expect(cell.kind).not.toBe(CellKind.WhitNotes)
		expect(cell.notes).toEqual(EMPTY_NOTES)
	})

	test('Should not be toggled notes.', () => {
		const cellAfterToggleNote = cell.toggleNote(5)

		expect(cell.id).toBe(cellAfterToggleNote.id)
		expect(cell.kind).not.toBe(CellKind.WhitNotes)
		expect(cell.notes).toEqual(EMPTY_NOTES)
	})

	test('Should not be removed notes.', () => {
		const cellAfterRemoveNote = cell.removeNote(5)

		expect(cell.id).toBe(cellAfterRemoveNote.id)
		expect(cell.kind).not.toBe(CellKind.WhitNotes)
		expect(cell.notes).toEqual(EMPTY_NOTES)
	})

	test('Should not change the cell value.', () => {
		const cellAfterChangeValue = cell.writeValue(5)

		expect(cell.id).toBe(cellAfterChangeValue.id)
		expect(cell.kind).not.toBe(CellKind.Unverified)
		expect(cell.value).toEqual(DEFAULT_OPTS.solution)
	})

	test('Should not be able to clean the cell.', () => {
		const cell = CellSvc.create({ ...DEFAULT_OPTS, isInitial: true })
		const cellAfterClear = cell.clear()

		expect(cell.id).toBe(cellAfterClear.id)
		expect(cell.kind).not.toBe(CellKind.Empty)
		expect(cell.value).toEqual(DEFAULT_OPTS.solution)
	})

	test('Should not be verified.', () => {
		const cellAfterVerify = cell.verify(noop)

		expect(cellAfterVerify.id).toBe(cell.id)
		expect(cellAfterVerify.kind).not.toBe(CellKind.Correct)
		expect(cellAfterVerify.kind).not.toBe(CellKind.Incorrect)
	})
})

describe.concurrent('Empty Cell Svc', () => {
	beforeEach(() => {
		cell = CellSvc.create({ ...DEFAULT_OPTS })
	})

	test('Should create an empty cell.', () => {
		expect(cell.kind).toBe(CellKind.Empty)
		expect(cell.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should return a new cell with the added note.', () => {
		const cellAfterAddNote = cell.addNote(5)

		expect(cell.id).not.toBe(cellAfterAddNote.id)
		expect(cellAfterAddNote.kind).toBe(CellKind.WhitNotes)
		expect(cellAfterAddNote.notes).toContain(5)
		expect(cellAfterAddNote.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should not be removed notes.', () => {
		const cellAfterRemoveNote = cell.removeNote(5)

		expect(cell.id).toBe(cellAfterRemoveNote.id)
		expect(cell.kind).not.toBe(CellKind.WhitNotes)
		expect(cell.notes).toEqual(EMPTY_NOTES)
	})

	test('Should return a new cell with the toggled note.', () => {
		const cellAfterToggleNote = cell.toggleNote(5)

		expect(cell.id).not.toBe(cellAfterToggleNote.id)
		expect(cellAfterToggleNote.kind).toBe(CellKind.WhitNotes)
		expect(cellAfterToggleNote.notes).toContain(5)
		expect(cellAfterToggleNote.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should return a new cell with the changed value.', () => {
		const cellAfterChangeValue = cell.writeValue(5)

		expect(cell.id).not.toBe(cellAfterChangeValue.id)
		expect(cellAfterChangeValue.kind).toBe(CellKind.Unverified)
		expect(cellAfterChangeValue.notes).toEqual(EMPTY_NOTES)
		expect(cellAfterChangeValue.value).toBe(5)
	})

	test('Should return the same cell unchanged.', () => {
		const cellAfterClear = cell.clear()

		expect(cell.id).toBe(cellAfterClear.id)
		expect(cellAfterClear.kind).toBe(CellKind.Empty)
		expect(cellAfterClear.notes).toEqual(EMPTY_NOTES)
		expect(cellAfterClear.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should not be verified.', () => {
		const cellAfterVerify = cell.verify(noop)

		expect(cellAfterVerify.id).toBe(cell.id)
		expect(cellAfterVerify.kind).not.toBe(CellKind.Correct)
		expect(cellAfterVerify.kind).not.toBe(CellKind.Incorrect)
	})
})

describe.concurrent('Notes Cell Svc', () => {
	beforeEach(() => {
		cell = CellSvc.create({ ...DEFAULT_OPTS })
			.addNote(5)
			.addNote(2)
	})

	test('Should create an unverified cell.', () => {
		expect(cell.kind).toBe(CellKind.WhitNotes)
		expect(cell.notes).toContain(5)
	})

	test('Should return a new cell with the added note.', () => {
		const cellAfterAddNote = cell.addNote(8)

		expect(cell.id).not.toBe(cellAfterAddNote.id)
		expect(cellAfterAddNote.kind).toBe(CellKind.WhitNotes)
		expect(cellAfterAddNote.notes).toEqual(expect.arrayContaining([5, 8]))
		expect(cellAfterAddNote.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should return a new cell with the removed note.', () => {
		const cellAfterRemoveNote = cell.removeNote(5)

		expect(cell.id).not.toBe(cellAfterRemoveNote.id)
		expect(cellAfterRemoveNote.kind).toBe(CellKind.WhitNotes)
		expect(cellAfterRemoveNote.notes).not.toContain(5)
		expect(cellAfterRemoveNote.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should return a new cell with the added note after toggling the note that did not exist.', () => {
		const cellAfterToggleNote = cell.toggleNote(8)

		expect(cell.id).not.toBe(cellAfterToggleNote.id)
		expect(cellAfterToggleNote.kind).toBe(CellKind.WhitNotes)
		expect(cellAfterToggleNote.notes).toContain(8)
		expect(cellAfterToggleNote.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should return a new cell with the removed note after toggling the note that did exist.', () => {
		const cellAfterToggleNote = cell.toggleNote(5)

		expect(cell.id).not.toBe(cellAfterToggleNote.id)
		expect(cellAfterToggleNote.kind).toBe(CellKind.WhitNotes)
		expect(cellAfterToggleNote.notes).not.toContain(5)
		expect(cellAfterToggleNote.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should return an empty cell after toggling the only notes it had.', () => {
		const cellAfterToggleNote = cell.toggleNote(5).toggleNote(2)

		expect(cell.id).not.toBe(cellAfterToggleNote.id)
		expect(cellAfterToggleNote.kind).toBe(CellKind.Empty)
		expect(cellAfterToggleNote.notes).toEqual(EMPTY_NOTES)
		expect(cellAfterToggleNote.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should return a new cell with the changed value.', () => {
		const cellAfterChangeValue = cell.writeValue(8)

		expect(cell.id).not.toBe(cellAfterChangeValue.id)
		expect(cellAfterChangeValue.kind).toBe(CellKind.Unverified)
		expect(cellAfterChangeValue.notes).toEqual(EMPTY_NOTES)
		expect(cellAfterChangeValue.value).toBe(8)
	})

	test('Should return the same cell unchanged.', () => {
		const cellAfterClear = cell.addNote(5)

		expect(cell.id).toBe(cellAfterClear.id)
		expect(cellAfterClear.kind).toBe(CellKind.WhitNotes)
		expect(cellAfterClear.notes).toContain(5)
		expect(cellAfterClear.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should return a new clean cell.', () => {
		const cellAfterChangeValue = cell.clear()

		expect(cell.id).not.toBe(cellAfterChangeValue.id)
		expect(cellAfterChangeValue.kind).toBe(CellKind.Empty)
		expect(cellAfterChangeValue.notes).toEqual(EMPTY_NOTES)
		expect(cellAfterChangeValue.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should not be verified.', () => {
		const cellAfterVerify = cell.verify(noop)

		expect(cellAfterVerify.id).toBe(cell.id)
		expect(cellAfterVerify.kind).not.toBe(CellKind.Correct)
		expect(cellAfterVerify.kind).not.toBe(CellKind.Incorrect)
	})
})

describe.concurrent('Unverified Cell Svc', () => {
	beforeEach(() => {
		cell = CellSvc.create({ ...DEFAULT_OPTS }).writeValue(5)
	})

	test('Should create an unverified cell.', () => {
		expect(cell.kind).toBe(CellKind.Unverified)
		expect(cell.value).toBe(5)
	})

	test('Should return a new cell with the added note.', () => {
		const cellAfterAddNote = cell.addNote(5)

		expect(cell.id).not.toBe(cellAfterAddNote.id)
		expect(cellAfterAddNote.kind).toBe(CellKind.WhitNotes)
		expect(cellAfterAddNote.notes).toContain(5)
		expect(cellAfterAddNote.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should not be removed notes.', () => {
		const cellAfterRemoveNote = cell.removeNote(5)

		expect(cell.id).toBe(cellAfterRemoveNote.id)
		expect(cell.kind).not.toBe(CellKind.WhitNotes)
		expect(cell.notes).toEqual(EMPTY_NOTES)
	})

	test('Should return a new cell with the toggled note.', () => {
		const cellAfterToggleNote = cell.toggleNote(5)

		expect(cell.id).not.toBe(cellAfterToggleNote.id)
		expect(cellAfterToggleNote.kind).toBe(CellKind.WhitNotes)
		expect(cellAfterToggleNote.notes).toContain(5)
		expect(cellAfterToggleNote.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should return a new cell with the changed value.', () => {
		const cellAfterChangeValue = cell.writeValue(8)

		expect(cell.id).not.toBe(cellAfterChangeValue.id)
		expect(cellAfterChangeValue.kind).toBe(CellKind.Unverified)
		expect(cellAfterChangeValue.notes).toEqual(EMPTY_NOTES)
		expect(cellAfterChangeValue.value).toBe(8)
	})

	test('Should return the same cell unchanged.', () => {
		const cellAfterClear = cell.writeValue(5)

		expect(cell.id).toBe(cellAfterClear.id)
		expect(cellAfterClear.kind).toBe(CellKind.Unverified)
		expect(cellAfterClear.notes).toEqual(EMPTY_NOTES)
		expect(cellAfterClear.value).toBe(5)
	})

	test('Should return a new clean cell.', () => {
		const cellAfterChangeValue = cell.clear()

		expect(cell.id).not.toBe(cellAfterChangeValue.id)
		expect(cellAfterChangeValue.kind).toBe(CellKind.Empty)
		expect(cellAfterChangeValue.notes).toEqual(EMPTY_NOTES)
		expect(cellAfterChangeValue.value).toBe(EMPTY_CELL_VALUE)
	})

	test('Should return an incorrect cell.', () => {
		const cellAfterVerify = cell.verify(noop)

		expect(cellAfterVerify.id).not.toBe(cell.id)
		expect(cellAfterVerify.kind).not.toBe(CellKind.Correct)
		expect(cellAfterVerify.kind).toBe(CellKind.Incorrect)
	})

	test('Should return an correct cell.', () => {
		const cellAfterVerify = cell.writeValue(DEFAULT_OPTS.solution).verify(noop)

		expect(cellAfterVerify.id).not.toBe(cell.id)
		expect(cellAfterVerify.kind).toBe(CellKind.Correct)
		expect(cellAfterVerify.kind).not.toBe(CellKind.Incorrect)
	})
})
