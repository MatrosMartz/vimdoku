import type { Position } from '~/share/domain/models'

import { createArray } from './create-array.util'

export function randomNumbers() {
	const numbers = createArray(9, i => i + 1)

	for (let i = numbers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i - 1))
		;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
	}
	return numbers
}

const [rows, cols] = [createArray(9, i => i), createArray(9, i => i)]
export function boardEach(fn: (pos: Position) => void) {
	for (const row of rows) for (const col of cols) fn({ row, col })
}

export const box = {
	row: (i: number, row: number) => (i % 3) + Math.trunc(row / 3) * 3,
	col: (i: number, col: number) => Math.trunc(i / 3) + Math.trunc(col / 3) * 3,
}
