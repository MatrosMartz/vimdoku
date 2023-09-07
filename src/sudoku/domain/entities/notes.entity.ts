import { InvalidNoteError } from '~/utils'

import type { NoteNumbers, NoteValue } from '../models'

export class Notes {
	#value: NoteValue

	constructor({ initValue }: { initValue?: NoteValue } = {}) {
		this.#value = Array(9).fill(null)
		if (initValue != null)
			for (const num of initValue)
				if (num != null) {
					if (num < 1 || num > 9) throw new InvalidNoteError(num)
					this.#value[num - 1] = num
				}
	}

	add(num: NoteNumbers) {
		this.#value[num - 1] = num
	}

	remove(num: NoteNumbers) {
		this.#value[num - 1] = null
	}

	toggle(num: NoteNumbers) {
		if (this.#value[num - 1] == null) this.add(num)
		else this.remove(num)
	}
}
