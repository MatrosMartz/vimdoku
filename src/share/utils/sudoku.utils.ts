import { createArray } from './create-array.util'

/**
 * Gets random unique numbers (1-9) array.
 * @returns The array.
 */
export function randomNumbers() {
	const numbers = createArray(9, i => i + 1)

	for (let i = numbers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i - 1))
		;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
	}
	return numbers
}

export const REG = {
	Y: (i: number, y: number) => (i % 3) + Math.floor(y / 3) * 3,
	X: (i: number, x: number) => Math.floor(i / 3) + Math.floor(x / 3) * 3,
}
