import { Pos, type PosData } from '~/share/domain/entities'
import type { Tuple } from '~/share/types'
import { InvalidSolutionError, randomNumbers, REG } from '~/share/utils'

import { Grid } from './grid.entity'
import { type ValidNumbers } from './notes.entity'

export type SolutionJSON = Tuple<Tuple<ValidNumbers, 9>, 9>

export type SolutionGrid = Grid<ValidNumbers>

/**
 * Create RegExp to match the error of: "Cannot read properties of undefined"
 * @returns The RegExp
 */
function cannotReadUndefined() {
	return /^Cannot read properties of undefined \(reading '[0-8]'\)/
}

/** Represent a Sudoku Solution Service. */
export class Solution {
	readonly #grid

	/**
	 * Creates an instance of the SolutionSvc class.
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
	 * @returns True if it complies with the structure, False if it doesn't.
	 */
	static check(grid: SolutionGrid) {
		try {
			for (const pos of Pos.iterateMatrix(9))
				if (grid.compare(pos).withRelated((comp, current) => comp === current)) return false
			return true
		} catch (err) {
			if (err instanceof TypeError && cannotReadUndefined().test(err.message)) return false
			throw err
		}
	}

	/**
	 * Create an instance of the SolutionSvc.
	 * @returns A new Solution.
	 */
	static create() {
		return new Solution(Solution.#fillSolution())
	}

	/**
	 * Create an instance of the SolutionSvc from a JSON string.
	 * @param solutionLike JSON representation of solution.
	 * @throws {InvalidSolutionError} If `solutionLike` is not a valid JSON string.
	 * @returns A solution based on solution like JSON.
	 */
	static fromString(solutionLike: string) {
		try {
			const initSolution = JSON.parse(solutionLike)
			return new Solution(new Grid(initSolution))
		} catch (err) {
			throw new InvalidSolutionError(solutionLike, err)
		}
	}

	/**
	 * Check if a Sudoku cell is safe to place a number.
	 * @param value The current Sudoku grid.
	 * @param num The number to check.
	 * @param position The position of the cell to check.
	 * @returns True if the cell value is safe with related cells.
	 */
	static #cellIsSafe(value: number[][], num: number, position: PosData): boolean
	static #cellIsSafe(value: number[][], num: number, { y, x }: PosData) {
		if (value[y][x] !== 0) return false

		for (let i = 0; i < 9; i++) {
			if (value[y][i] === num) return false
			if (value[i][x] === num) return false
			if (value[REG.Y(i, y)][REG.X(i, x)] === num) return false
		}

		return true
	}

	/**
	 * Create a Sudoku solution data.
	 * @returns A Grid of valid numbers.
	 */
	static #fillSolution() {
		let value = Pos.createMatrix(9, () => 0)
		for (let i = 0; i < 9; i++) {
			const retry = () => {
				value = Pos.createMatrix(9, () => 0)
				i = -1
			}
			for (let j = i; j < 9; j++) {
				const numbers = randomNumbers()
				for (const num of numbers) if (this.#cellIsSafe(value, num, { y: i, x: j })) value[i][j] = num

				for (const num of [...numbers].reverse()) if (this.#cellIsSafe(value, num, { y: j, x: i })) value[j][i] = num

				if (value[i][j] === 0 || value[j][i] === 0) {
					retry()
					break
				}
			}
		}
		return new Grid(value as Tuple<Tuple<ValidNumbers, 9>, 9>)
	}

	toJSON(): SolutionJSON {
		return this.#grid.data
	}

	toString() {
		const col = ' | '
		const row = '\n- - - + - - - + - - -\n'
		return this.grid.join.all({ col, row })
	}
}
