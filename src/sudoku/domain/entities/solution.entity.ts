import { box, createMatrix, InvalidSolutionError, iterateMatrix, randomNumbers } from '~/utils'

import type { Position } from './position.entity'

function checkErrorRgx() {
	return /^Cannot read properties of undefined \(reading '[0-8]'\)/
}

export type SolutionValue = number[][]

export interface SolutionInitOpts {
	/** Initial Sudoku solution (optional). */
	initSolution?: SolutionValue
}

export interface ISolution {
	/** Get the current solution. */
	get value(): SolutionValue
}

/** Represent a Sudoku solution. */
export class Solution implements ISolution {
	#value

	/**
	 * Creates an instance of the Solution class.
	 * @throws {InvalidBoardError} If `initSolution` is invalid.
	 */
	constructor(opts?: SolutionInitOpts)
	constructor({ initSolution }: SolutionInitOpts = {}) {
		if (!Solution.check(initSolution!)) throw new InvalidSolutionError(initSolution)
		if (initSolution != null) this.#value = initSolution
		else this.#value = this.#fillSudoku()
	}

	get value() {
		return structuredClone(this.#value)
	}

	/**
	 * Check if a given Sudoku solution is valid.
	 * @param {SolutionValue} solution The Sudoku solution to check.
	 */
	static check(solution: SolutionValue) {
		try {
			for (const { row, col } of iterateMatrix(9)) {
				const num = solution[row][col]
				if (num <= 0 || num >= 10) return false
				for (let i = 0; i < 9; i++) {
					if (solution[row][i] === num) return false
					if (solution[i][col] === num) return false
					if (solution[box.row(i, row)][box.col(i, col)] === num) return false
				}
			}
			return true
		} catch (err) {
			if (err instanceof TypeError && checkErrorRgx().test(err.message)) return false
			throw err
		}
	}

	/**
	 * Create instance of Solution class from a JSON string.
	 * @param {string} solutionLike JSON representation of solution.
	 * @throws {InvalidSolutionError} - If `solutionLike` is not a valid JSON string.
	 * @example
	 * const solutionJSON = JSON.stringify(solutionInstance)
	 * const newSolutionInstance = Solution.from(solutionJSON)
	 */
	static from(solutionLike: string) {
		if (typeof solutionLike === 'string') {
			const initSolution = JSON.parse(solutionLike)
			return new Solution({ initSolution })
		}
		throw new InvalidSolutionError(solutionLike)
	}

	/** Converts Solution instance in JSON. */
	toJSON() {
		return this.value
	}

	/** Converts the Solution instance to a string representation of the Sudoku grid. */
	toString() {
		const colsSeparator = ' | '
		const rowsSeparator = '\n- - - + - - - + - - -\n'
		return this.value.map(row => row.join(colsSeparator)).join(rowsSeparator)
	}

	/**
	 * Check if a Sudoku cell is safe to place a number.
	 * @param {SolutionValue} value - The current Sudoku grid.
	 * @param {number} num - The number to check.
	 * @param {Position} position - The position of the cell to check.
	 * @private
	 */
	#cellIsSafe(value: SolutionValue, num: number, { row, col }: Position) {
		if (value[row][col] !== 0) return false

		for (let i = 0; i < 9; i++) {
			if (value[row][i] === num) return false
			if (value[i][col] === num) return false
			if (value[box.row(i, row)][box.col(i, col)] === num) return false
		}

		return true
	}

	/**
	 * Fill the Sudoku grid with a valid Sudoku solution.
	 * @private
	 */
	#fillSudoku() {
		let value = createMatrix(9, { value: 0 })
		for (let i = 0; i < 9; i++) {
			const retry = () => {
				value = createMatrix(9, { value: 0 })
				i = -1
			}
			for (let j = i; j < 9; j++) {
				const numbers = randomNumbers()
				for (const num of numbers) if (this.#cellIsSafe(value, num, { row: i, col: j })) value[i][j] = num

				for (const num of numbers.reverse()) if (this.#cellIsSafe(value, num, { row: j, col: i })) value[j][i] = num

				if (this.#value[i][j] === 0 || this.#value[j][i] === 0) {
					retry()
					break
				}
			}
		}
		return value
	}
}
