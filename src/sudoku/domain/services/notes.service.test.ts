import {randomUUID} from 'node:crypto'

import { beforeAll, describe, expect, test, vi } from 'vitest'

import { NotesSvc } from './notes.service'


beforeAll(() => {
	const crypto = {randomUUID}
	
	vi.stubGlobal('crypto', crypto)
	return () => vi.unstubAllGlobals()
})

describe.concurrent('Notes Svc', () => {
	test('Should add note "nine".', () => {
		const notes = NotesSvc.create([1, 2, 3, 4, 5, 6, 7, 8])

		expect(notes.add(9).data).toContain(9)
	})

	test('Should delete all notes.', () => {
		const notes = NotesSvc.create([1,2,3,4,5,6,7,8,9])

		expect(notes.clear().data).toEqual([null,null,null,null,null,null,null,null,null])
	})

	test('Should be true if the note exists and false if it does not.', () => {
		const notes = NotesSvc.create([1,2,3,4])

		expect(notes.has(1)).toBe(true)
		expect(notes.has(9)).toBe(false)
	})

	test('Should remove note "one".', () => {
		const notes = NotesSvc.create([1, 2, 3, 4, 5, 6, 7, 8, 9])

		expect(notes.remove(1).data).not.toContain(1)
	})

	test('Should toggle note "five".', () => {
		const notes = NotesSvc.create([1, 2, 3, 4, 5, 6, 7, 8, 9])

		const toggleOne = notes.toggle(5)
		expect(toggleOne.data).not.toContain(5)
		expect(toggleOne.toggle(5).data).toContain(5)
	})

	test('Should return a new service only when adding the note.', () => {
		const notes = NotesSvc.create([1, 2, 3, 4, 5])

		expect(notes.add(1).id).toBe(notes.id)
		expect(notes.add(9).id).not.toBe(notes.id)
	})

	test('Should return a new service only when removing the note.', () => {
		const notes = NotesSvc.create([1, 2, 3, 4, 5])

		expect(notes.remove(9).id).toBe(notes.id)
		expect(notes.remove(1).id).not.toBe(notes.id)
	})

	test('Should return a new service whenever the note is toggled.', () => {
		const notes = NotesSvc.create([1, 2, 3, 4, 5])

		expect(notes.toggle(9).id).not.toBe(notes.id)
		expect(notes.toggle(1).id).not.toBe(notes.id)
	})
})
