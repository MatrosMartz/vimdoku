import { describe, expect, test } from 'vitest'

import { Grid } from './grid.entity'

describe.concurrent('Grid Service', () => {
	test('The data should be an array.', () => {
		const initialGrid = Grid.create(pos => pos.y)

		expect(Array.isArray(initialGrid.data)).toBeTrue()
	})

	test('Each cell should contain the value of its row.', () => {
		const initialGrid = Grid.create(pos => pos.x)

		expect(initialGrid.data).toEqual([
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
		])
	})

	test('The copy data should be the same as the original.', () => {
		const initialGrid = Grid.create(pos => pos.x)

		expect(initialGrid.data).toEqual(initialGrid.copy().data)
	})

	test('The counter should be working properly.', () => {
		const initialGrid = Grid.create(pos => pos.x)

		expect(initialGrid.count(cell => cell === 7)).toBe(9)
	})

	test('Should create the subgrids "foo" and "bar".', () => {
		const initialGrid = Grid.create(pos => ({ foo: pos.x, bar: pos.y }))

		const { bar, foo } = initialGrid.subgrids.unwrapped(cell => cell)

		expect(foo).toEqual([
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
		])

		expect(bar).toEqual([
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[2, 2, 2, 2, 2, 2, 2, 2, 2],
			[3, 3, 3, 3, 3, 3, 3, 3, 3],
			[4, 4, 4, 4, 4, 4, 4, 4, 4],
			[5, 5, 5, 5, 5, 5, 5, 5, 5],
			[6, 6, 6, 6, 6, 6, 6, 6, 6],
			[7, 7, 7, 7, 7, 7, 7, 7, 7],
			[8, 8, 8, 8, 8, 8, 8, 8, 8],
		])
	})
})

describe.concurrent('Grid Mapper', () => {
	test('Should multiply the whole grid by 5.', () => {
		const initialGrid = Grid.create(pos => pos.x)

		expect(initialGrid.mapAll(cell => cell * 5).data).toEqual([
			[0, 5, 10, 15, 20, 25, 30, 35, 40],
			[0, 5, 10, 15, 20, 25, 30, 35, 40],
			[0, 5, 10, 15, 20, 25, 30, 35, 40],
			[0, 5, 10, 15, 20, 25, 30, 35, 40],
			[0, 5, 10, 15, 20, 25, 30, 35, 40],
			[0, 5, 10, 15, 20, 25, 30, 35, 40],
			[0, 5, 10, 15, 20, 25, 30, 35, 40],
			[0, 5, 10, 15, 20, 25, 30, 35, 40],
			[0, 5, 10, 15, 20, 25, 30, 35, 40],
		])
	})

	test('Should set the value of the cell selected to 10.', () => {
		const initialGrid = Grid.create(pos => pos.x)

		expect(
			initialGrid
				.mapBy({ y: 4, x: 4 })
				.cell(() => 10)
				.apply().data
		).toEqual([
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
		])
	})

	test('Should set the value of every cell in the same row to 10.', () => {
		const initialGrid = Grid.create(pos => pos.x)

		expect(
			initialGrid
				.mapBy({ y: 4, x: 4 })
				.row(() => 10)
				.apply().data
		).toEqual([
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[10, 10, 10, 10, 10, 10, 10, 10, 10],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
		])
	})

	test('Should set the value of every cell in the same row to 10.', () => {
		const initialGrid = Grid.create(pos => pos.x)

		expect(
			initialGrid
				.mapBy({ y: 4, x: 4 })
				.col(() => 10)
				.apply().data
		).toEqual([
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
		])
	})

	test('Should set the value of every cell in the same box to 10.', () => {
		const initialGrid = Grid.create(pos => pos.x)

		expect(
			initialGrid
				.mapBy({ y: 4, x: 4 })
				.reg(() => 10)
				.apply().data
		).toEqual([
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 10, 10, 10, 6, 7, 8],
			[0, 1, 2, 10, 10, 10, 6, 7, 8],
			[0, 1, 2, 10, 10, 10, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
			[0, 1, 2, 3, 4, 5, 6, 7, 8],
		])
	})

	test('Should set the value of every related cell to 10.', () => {
		const initialGrid = Grid.create(pos => pos.x)

		expect(
			initialGrid
				.mapBy({ y: 4, x: 4 })
				.related(() => 10)
				.apply().data
		).toEqual([
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 10, 10, 10, 6, 7, 8],
			[10, 10, 10, 10, 10, 10, 10, 10, 10],
			[0, 1, 2, 10, 10, 10, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
		])
	})

	test('Should set the value of each related cell other than the origin to 10.', () => {
		const initialGrid = Grid.create(pos => pos.x)

		expect(
			initialGrid
				.mapBy({ y: 4, x: 4 })
				.related.withoutOrigin(() => 10)
				.apply().data
		).toEqual([
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 10, 10, 10, 6, 7, 8],
			[10, 10, 10, 10, 4, 10, 10, 10, 10],
			[0, 1, 2, 10, 10, 10, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
		])
	})

	test('Should skip the declared functions if the condition is false.', () => {
		const initialGrid = Grid.create(pos => pos.x)

		expect(
			initialGrid
				.mapBy({ y: 4, x: 4 })
				.related.onlyIf(false, () => 10)
				.apply().data
		).toEqual(initialGrid.data)
	})

	test('Should execute the declared functions if the condition is true.', () => {
		const initialGrid = Grid.create(pos => pos.x)

		expect(
			initialGrid
				.mapBy({ y: 4, x: 4 })
				.related.onlyIf(true, () => 10)
				.apply().data
		).toEqual([
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 10, 10, 10, 6, 7, 8],
			[10, 10, 10, 10, 10, 10, 10, 10, 10],
			[0, 1, 2, 10, 10, 10, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
			[0, 1, 2, 3, 10, 5, 6, 7, 8],
		])
	})
})
