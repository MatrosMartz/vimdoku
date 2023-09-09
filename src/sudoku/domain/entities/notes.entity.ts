import { InvalidLikeError, InvalidNoteError } from '~/utils'

import type { NoteNumbers, NoteValue } from '../models'

export class Notes {
	#value: NoteValue

	constructor({ initNotes }: { initNotes?: NoteValue } = {}) {
		this.#value = Array(9).fill(null)
		if (initNotes != null)
			for (const num of initNotes)
				if (num != null) {
					if (num < 1 || num > 9) throw new InvalidNoteError(num)
					this.#value[num - 1] = num
				}
	}

	get value() {
		return structuredClone(this.#value)
	}

	static from(noteLike: unknown) {
		if (typeof noteLike === 'string') {
			const initNotes = JSON.parse(noteLike)
			return new Notes({ initNotes })
		}
		throw new InvalidLikeError('note', noteLike)
	}

	add(num: NoteNumbers) {
		this.#value[num - 1] = num
	}

	remove(num: NoteNumbers) {
		this.#value[num - 1] = null
	}

	toJSON() {
		return this.value
	}

	toString() {
		return JSON.stringify(this.#value)
	}

	toggle(num: NoteNumbers) {
		if (this.#value[num - 1] == null) this.add(num)
		else this.remove(num)
	}
}
