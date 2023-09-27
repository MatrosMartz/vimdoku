import type { BrowserStorage } from '~/utils'
import { Solution } from '$sudoku/domain/models'
import type { SolutionRepo } from '$sudoku/domain/repositories'

export class BrowserSolutionRepo implements SolutionRepo {
	#storage: BrowserStorage

	constructor(name = 'solution') {
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

	async create() {
		const solution = Solution.create()
		this.#storage.set(solution.toString())
	}

	async delete() {
		this.#storage.del()
	}

	async getSolution() {
		const data = this.#storage.get()

		return data == null ? null : Solution.from(data)
	}

	async has() {
		return this.#storage.get() != null
	}
}
