import { box, createMatrix, iterateMatrix, randomNumbers } from '~/utils'
import { InvalidSolutionError } from '~/utils/errors.util'

import type { Position, SolutionValue } from '../models'

export class Solution {
	#value: SolutionValue

	constructor({ initValue }: { initValue?: SolutionValue } = {}) {
		if (initValue != null && Solution.check(initValue)) this.#value = initValue
		else this.#value = this.#fillSudoku()
	}

	get value() {
		return this.#value
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
