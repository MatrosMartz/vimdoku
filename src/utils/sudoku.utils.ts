import type { Position } from '~/sudoku/domain/models'

import { createArray } from './create-array.util'

export function randomNumbers() {
	const numbers = createArray(9, { fn: i => i + 1 })

	for (let i = numbers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i - 1))
		;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
	}
	return numbers
}

const [rows, cols] = [createArray(9, { fn: i => i }), createArray(9, { fn: i => i })]
export function boardEach(fn: (pos: Position) => void) {
	for (const row of rows) for (const col of cols) fn({ row, col })
}

/* export function createBoard({ difficulty, solution }: BoardOpts) {
	const boardValue: BoardModel = []
	for (let row = 0; row < 9; row++) {
		boardValue[row] = []
		for (let col = 0; col < 9; col++) {
			const isInitial = probabilityToBeInitial(difficulty) as boolean
			const kind = isInitial ? CellKinds.Initial : CellKinds.Empty
			const value = isInitial ? solution.value[row][col] : BoardService.EMPTY_BOX_VALUE

			boardValue[row][col] = { notes: new Notes(), kind, value }
		}
	}
	return boardValue
} */

export const box = {
	row: (i: number, row: number) => (i % 3) + Math.trunc(row / 3) * 3,
	col: (i: number, col: number) => Math.trunc(i / 3) + Math.trunc(col / 3) * 3,
}
