import { createArray } from './create-array.util'

export function randomNumbers() {
	const numbers = createArray(9, i => i + 1)

	for (let i = numbers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i - 1))
		;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
	}
	return numbers
}

export const box = {
	y: (i: number, y: number) => (i % 3) + Math.trunc(y / 3) * 3,
	x: (i: number, x: number) => Math.trunc(i / 3) + Math.trunc(x / 3) * 3,
}
