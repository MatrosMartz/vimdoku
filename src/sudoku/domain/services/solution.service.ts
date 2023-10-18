import type { Position } from '~/share/domain/models'
import type { Tuple } from '~/share/types'
import { box, createMatrix, InvalidSolutionError, iterateMatrix, randomNumbers } from '~/share/utils'

import { type ISolution, type SolutionGrid, type SolutionJSON, type ValidNumbers } from '../models'
import { GridService } from './grid.service'

function notArrayErrorMsgRgx() {
	return /^Cannot read properties of undefined \(reading '[0-8]'\)/
}

/** Represent a Sudoku Solution Service. */
export class SolutionService implements ISolution {
	#grid

	/**
	 * Creates an instance of the SolutionService class.
	 * @param grid Solution Data.
	 */
	constructor(grid: SolutionGrid) {
		this.#grid = grid
	}

	get data() {
		return this.toJSON()
	}

	get grid() {
		return this.#grid.copy()
	}

	/**
	 * Check if a given Sudoku solution is valid.
	 * @param grid The Sudoku solution to check.
	 */
	static check(grid: SolutionGrid) {
		try {
			for (const pos of iterateMatrix(9))
				if (grid.compareRelated(pos, (comp, current) => comp === current)) return false
			return true
		} catch (err) {
			if (err instanceof TypeError && notArrayErrorMsgRgx().test(err.message)) return false
			throw err
		}
	}

	/** Create an instance of the SolutionService. */
	static create() {
		return new SolutionService(SolutionService.#fillSolution())
	}

	/**
	 * Create an instance of the SolutionService from a JSON string.
	 * @param solutionLike JSON representation of solution.
	 * @throws {InvalidSolutionError} If `solutionLike` is not a valid JSON string.
	 * @example
	 * const solutionJSON = JSON.stringify(solutionInstance)
	 * const newSolutionInstance = Solution.from(solutionJSON)
	 */
	static fromString(solutionLike: string) {
		try {
			const initSolution = JSON.parse(solutionLike)
			return new SolutionService(new GridService(initSolution))
		} catch (err) {
			throw new InvalidSolutionError(solutionLike, err)
		}
	}

	/**
	 * Check if a Sudoku cell is safe to place a number.
	 * @param value The current Sudoku grid.
	 * @param num The number to check.
	 * @param position The position of the cell to check.
	 * @private
	 */
	static #cellIsSafe(value: number[][], num: number, { y, x }: Position) {
		if (value[y][x] !== 0) return false

		for (let i = 0; i < 9; i++) {
			if (value[y][i] === num) return false
			if (value[i][x] === num) return false
			if (value[box.y(i, y)][box.x(i, x)] === num) return false
		}

		return true
	}

	/** Create a Sudoku solution data. */
	static #fillSolution() {
		let value = createMatrix(9, () => 0)
		for (let i = 0; i < 9; i++) {
			const retry = () => {
				value = createMatrix(9, () => 0)
				i = -1
			}
			for (let j = i; j < 9; j++) {
				const numbers = randomNumbers()
				for (const num of numbers) if (this.#cellIsSafe(value, num, { y: i, x: j })) value[i][j] = num

				for (const num of numbers.reverse()) if (this.#cellIsSafe(value, num, { y: j, x: i })) value[j][i] = num

				if (value[i][j] === 0 || value[j][i] === 0) {
					retry()
					break
				}
			}
		}
		return new GridService(value as Tuple<Tuple<ValidNumbers, 9>, 9>)
	}

	toJSON(): SolutionJSON {
		return this.#grid.data
	}

	toString() {
		const x = ' | '
		const y = '\n- - - + - - - + - - -\n'
		return this.grid.joinGrid({ x, y })
	}
}
