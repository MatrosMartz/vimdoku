import { randomUUID } from 'node:crypto'

import { beforeAll, describe, expect, test, vi } from 'vitest'

import { EMPTY_NOTES, Notes } from './notes.entity'

beforeAll(() => {
	const crypto = { randomUUID }

	vi.stubGlobal('crypto', crypto)
	return () => vi.unstubAllGlobals()
})

describe.concurrent('Notes', () => {
	test('Should add note "nine".', () => {
		const notes = Notes.create([1, 2, 3, 4, 5, 6, 7, 8])

		expect(notes.add(9).data).toContain(9)
	})

	test('Should have the same data as the original, but a different id.', () => {
		const notes = Notes.create([1, 2, 3, 4, 5, 6, 7, 8, 9])
		const copyNotes = notes.copy()

		expect(notes.id).not.toBe(copyNotes.id)
		expect(notes.data).toEqual(copyNotes.data)
	})
	test('Should delete all notes.', () => {
		const notes = Notes.create([1, 2, 3, 4, 5, 6, 7, 8, 9])

		expect(notes.clear().data).toEqual(EMPTY_NOTES)
	})

	test('Should be true if the note exists and false if it does not.', () => {
		const notes = Notes.create([1, 2, 3, 4])

		expect(notes.has(1)).toBeTrue()
		expect(notes.has(9)).toBeFalse()
	})

	test('Should remove note "one".', () => {
		const notes = Notes.create([1, 2, 3, 4, 5, 6, 7, 8, 9])

		expect(notes.remove(1).data).not.toContain(1)
	})

	test('Should toggle note "five".', () => {
		const notes = Notes.create([1, 2, 3, 4, 5, 6, 7, 8, 9])

		const toggleOne = notes.toggle(5)
		expect(toggleOne.data).not.toContain(5)
		expect(toggleOne.toggle(5).data).toContain(5)
	})

	test('Should return a new service only when adding the note.', () => {
		const notes = Notes.create([1, 2, 3, 4, 5])

		expect(notes.add(1).id).toBe(notes.id)
		expect(notes.add(9).id).not.toBe(notes.id)
	})

	test('should be true if the notes are empty.', () => {
		const notes = Notes.create([])

		expect(notes.data).toEqual(EMPTY_NOTES)
		expect(notes.isEmpty).toBeTrue()
	})

	test('should be false if there is at least a note.', () => {
		const notes = Notes.create([1])

		expect(notes.data).not.toEqual(EMPTY_NOTES)
		expect(notes.isEmpty).toBeFalse()
	})

	test('Should return a new service only when removing the note.', () => {
		const notes = Notes.create([1, 2, 3, 4, 5])

		expect(notes.remove(9).id).toBe(notes.id)
		expect(notes.remove(1).id).not.toBe(notes.id)
	})

	test('Should return a new service whenever the note is toggled.', () => {
		const notes = Notes.create([1, 2, 3, 4, 5])

		expect(notes.toggle(9).id).not.toBe(notes.id)
		expect(notes.toggle(1).id).not.toBe(notes.id)
	})

	test('Should return the result of the multiplied prime numbers relating to the existing notes.', () => {
		const notes = Notes.create([1, 2, 4, 7, 8])

		expect(notes.toNumber()).toBe(2 * 3 * 7 * 17 * 19)
	})

	test('Should have the notes corresponding to the multiplied primes.', () => {
		const notes = Notes.fromNumber(2 * 5 * 13)

		expect(notes.has(1)).toBeTrue()
		expect(notes.has(3)).toBeTrue()
		expect(notes.has(6)).toBeTrue()
	})
})
