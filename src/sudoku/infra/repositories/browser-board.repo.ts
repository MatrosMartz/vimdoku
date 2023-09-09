import { Board, type BoardOpts } from '~/sudoku/domain/entities'
import type { BrowserStorage } from '~/utils'
import type { BoardRepo } from '$sudoku/domain/repositories'

export class BrowserBoardRepo implements BoardRepo {
	#storage: BrowserStorage

	constructor(name = 'board') {
		this.#storage = {
			del() {
				localStorage.removeItem(name)
			},
			get: () => localStorage.getItem(name),
			set(value) {
				localStorage.setItem(name, value)
			},
		}
	}

	async create(opts?: BoardOpts) {
		this.#storage.set(Board.create(opts).toString())
	}

	async delete() {
		this.#storage.del()
	}

	async getBoard() {
		const data = this.#storage.get()
		return data == null ? null : Board.from(data)
	}

	async has() {
		return this.#storage.get() != null
	}
}
