import { describe, expect, test } from 'vitest'

import { Prtcl } from '~/share/utils'

import * as Pos from './position.entity'

describe.concurrent('Position entity', () => {
	test('Should have the column and row that was established', () => {
		const pos = new Pos.Pos({ row: 0, col: 0 })

		expect(pos.col).toBe(0)
		expect(pos.row).toBe(0)
	})

	test.each([
		{ row: Math.floor(Math.random() * 3), col: Math.floor(Math.random() * 3), reg: 0 },
		{ row: Math.floor(Math.random() * 3), col: Math.floor(Math.random() * 3) + 3, reg: 1 },
		{ row: Math.floor(Math.random() * 3), col: Math.floor(Math.random() * 3) + 6, reg: 2 },
		{ row: Math.floor(Math.random() * 3) + 3, col: Math.floor(Math.random() * 3), reg: 3 },
		{ row: Math.floor(Math.random() * 3) + 3, col: Math.floor(Math.random() * 3) + 3, reg: 4 },
		{ row: Math.floor(Math.random() * 3) + 3, col: Math.floor(Math.random() * 3) + 6, reg: 5 },
		{ row: Math.floor(Math.random() * 3) + 6, col: Math.floor(Math.random() * 3), reg: 6 },
		{ row: Math.floor(Math.random() * 3) + 6, col: Math.floor(Math.random() * 3) + 3, reg: 7 },
		{ row: Math.floor(Math.random() * 3) + 6, col: Math.floor(Math.random() * 3) + 6, reg: 8 },
	])('Pos { col: $col, row: $row } should have reg with the value $reg', ({ row, col, reg }) => {
		expect(new Pos.Pos({ row, col }).reg).toBe(reg)
	})

	test('Should comparate if two positions are equals', () => {
		const pos1 = new Pos.Pos({ row: 0, col: 0 })

		expect(Prtcl.equals(pos1, new Pos.Pos({ row: 1, col: 0 }))).toBeFalse()
		expect(Prtcl.equals(pos1, new Pos.Pos({ row: 0, col: 1 }))).toBeFalse()
		expect(Prtcl.equals(pos1, new Pos.Pos({ row: 1, col: 1 }))).toBeFalse()
		expect(Prtcl.equals(pos1, new Pos.Pos({ row: 0, col: 0 }))).toBeTrue()
	})

	test('Should comparate if two positions are related', () => {
		const pos1 = new Pos.Pos({ row: 0, col: 0 })

		expect(Prtcl.related(pos1, new Pos.Pos({ row: 2, col: 1 }))).toBeTrue()
		expect(Prtcl.related(pos1, new Pos.Pos({ row: 1, col: 2 }))).toBeTrue()
		expect(Prtcl.related(pos1, new Pos.Pos({ row: 0, col: 8 }))).toBeTrue()
		expect(Prtcl.related(pos1, new Pos.Pos({ row: 8, col: 0 }))).toBeTrue()
		expect(Prtcl.related(pos1, new Pos.Pos({ row: 0, col: 0 }))).toBeTrue()
		expect(Prtcl.related(pos1, new Pos.Pos({ row: 5, col: 5 }))).toBeFalse()
	})

	test('Should return a new position with the summed columns or rows', () => {
		const pos1 = new Pos.Pos({ row: 1, col: 1 })

		expect(pos1.sum({ row: 5 })).toEqual(new Pos.Pos({ row: 6, col: 1 }))
		expect(pos1.sum({ col: 5 })).toEqual(new Pos.Pos({ row: 1, col: 6 }))
		expect(pos1.sum({ row: 3, col: 3 })).toEqual(new Pos.Pos({ row: 4, col: 4 }))
		expect(pos1.sum({ row: 0, col: 0 })).toEqual(pos1)
	})

	test('Should string parse the position', () => {
		expect(String(new Pos.Pos({ row: 0, col: 0 }))).toBe('0-0')
		expect(String(new Pos.Pos({ row: 2, col: 0 }))).toBe('2-0')
		expect(String(new Pos.Pos({ row: 0, col: 2 }))).toBe('0-2')
	})
})
