import { box, createMatrix, InvalidSolutionError, iterateMatrix, randomNumbers } from '~/utils'

import type { ValidNumbers } from './cell-notes.model'
import { type ISudokuGrid, SudokuGrid } from './grid.model'
import type { Position } from './position.model'

function checkErrorRgx() {
	return /^Cannot read properties of undefined \(reading '[0-8]'\)/
}

export type SolutionData = ISudokuGrid<ValidNumbers>

export interface SolutionInitOpts {
	/** Initial Sudoku solution (optional). */
	initSolution?: SolutionData
}

export interface ISolution {
	/** Get the current solution. */
	get data(): SolutionData
	/** Converts the Solution instance to a string representation of the Sudoku grid. */
	toString(): string
}

/** Represent a Sudoku solution. */
export class Solution implements ISolution {
	#data

	/**
	 * Creates an instance of the Solution class.
	 * @param {SolutionData} data Solution Data.
	 */
	constructor(data: SolutionData) {
		this.#data = data
	}

	get data() {
		return structuredClone(this.#data)
	}

	/**
	 * Check if a given Sudoku solution is valid.
	 * @param {SolutionData} solution The Sudoku solution to check.
	 */
	static check(solution: SolutionData) {
		try {
			for (const pos of iterateMatrix(9))
				if (solution.compareRelated(pos, (comp, current) => comp === current)) return false
			return true
		} catch (err) {
			if (err instanceof TypeError && checkErrorRgx().test(err.message)) return false
			throw err
		}
	}

	/** Create new instance of Solution class. */
	static create() {
		return new Solution(Solution.#fillSolution())
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
			return new Solution(initSolution)
		}
		throw new InvalidSolutionError(solutionLike)
	}

	/**
	 * Check if a Sudoku cell is safe to place a number.
	 * @param {SolutionData} value - The current Sudoku grid.
	 * @param {number} num - The number to check.
	 * @param {Position} position - The position of the cell to check.
	 * @private
	 */
	static #cellIsSafe(value: number[][], num: number, { row, col }: Position) {
		if (value[row][col] !== 0) return false

		for (let i = 0; i < 9; i++) {
			if (value[row][i] === num) return false
			if (value[i][col] === num) return false
			if (value[box.row(i, row)][box.col(i, col)] === num) return false
		}

		return true
	}

	/** Create a Sudoku solution data. */
	static #fillSolution() {
		let data = createMatrix(9, () => 0)
		for (let i = 0; i < 9; i++) {
			const retry = () => {
				data = createMatrix(9, () => 0)
				i = -1
			}
			for (let j = i; j < 9; j++) {
				const numbers = randomNumbers()
				for (const num of numbers) if (this.#cellIsSafe(data, num, { row: i, col: j })) data[i][j] = num

				for (const num of numbers.reverse()) if (this.#cellIsSafe(data, num, { row: j, col: i })) data[j][i] = num

				if (data[i][j] === 0 || data[j][i] === 0) {
					retry()
					break
				}
			}
		}
		return new SudokuGrid(data as ValidNumbers[][])
	}

	toString() {
		const col = ' | '
		const row = '\n- - - + - - - + - - -\n'
		return this.data.joinGrid({ col, row })
	}
}
