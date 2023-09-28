import type { BrowserStorage } from '~/share/utils'
import { type BoardOpts, type DifficultyKinds, Solution } from '$sudoku/domain/models'
import type { BoardOptsRepo } from '$sudoku/domain/repositories'

export class BrowserBoardOptsRepo implements BoardOptsRepo {
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

	async getBoardOpts(): Promise<BoardOpts | null> {
		interface DataType {
			difficulty: DifficultyKinds
			solution: string
		}
		const data = this.#storage.get()!

		if (data == null) return null

		const { difficulty, solution }: DataType = JSON.parse(data)

		return { difficulty, solution: Solution.from(solution) }
	}

	async has() {
		return this.#storage.get() != null
	}
}
