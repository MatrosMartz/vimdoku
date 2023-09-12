import { box, createMatrix, InvalidLikeError, InvalidSolutionError, iterateMatrix, randomNumbers } from '~/utils'

import type { Position, SolutionValue } from '../models'

export class Solution {
	#value

	constructor({ initSolution }: { initSolution?: SolutionValue } = {}) {
		if (initSolution != null && Solution.check(initSolution)) this.#value = initSolution
		else this.#value = this.#fillSudoku()
	}

	get value() {
		return structuredClone(this.#value)
	}

	static check(solution: SolutionValue) {
		for (const { row, col } of iterateMatrix(9)) {
			const num = solution[row][col]
			if (num <= 0 || num >= 10) throw new InvalidSolutionError({ solution, pos: { row, col }, type: 'range' })
			for (let i = 0; i < 9; i++) {
				if (solution[row][i] === num) throw new InvalidSolutionError({ solution, pos: { row, col }, type: 'row' })
				if (solution[i][col] === num) throw new InvalidSolutionError({ solution, pos: { row, col }, type: 'col' })
				if (solution[box.row(i, row)][box.col(i, col)] === num)
					throw new InvalidSolutionError({ solution, pos: { row, col }, type: 'box' })
			}
		}

		return true
	}

	static from(solutionLike: string) {
		if (typeof solutionLike === 'string') {
			const initSolution = JSON.parse(solutionLike)
			return new Solution({ initSolution })
		}
		throw new InvalidLikeError('solution', solutionLike)
	}

	toJSON() {
		return this.value
	}

	toString() {
		return JSON.stringify(this.#value)
	}

	#fillSudoku() {
		let value = createMatrix(9, { value: 0 })
		for (let i = 0; i < 9; i++) {
			const retry = () => {
				value = createMatrix(9, { value: 0 })
				i = -1
			}
			for (let j = i; j < 9; j++) {
				const numbers = randomNumbers()
				for (const num of numbers) if (this.#isSafe(value, num, { row: i, col: j })) value[i][j] = num

				for (const num of numbers.reverse()) if (this.#isSafe(value, num, { row: j, col: i })) value[j][i] = num

				if (this.#value[i][j] === 0 || this.#value[j][i] === 0) {
					retry()
					break
				}
			}
		}
		return value
	}

	#isSafe(value: number[][], num: number, { row, col }: Position) {
		if (value[row][col] !== 0) return false

		for (let i = 0; i < 9; i++) {
			if (value[row][i] === num) return false
			if (value[i][col] === num) return false
			if (value[box.row(i, row)][box.col(i, col)] === num) return false
		}

		return true
	}
}
