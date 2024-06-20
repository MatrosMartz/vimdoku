import { describe, expectTypeOf, test } from 'vitest'

import type * as Pos from './position.entity'

describe('Pos.GetRange', () => {
	test('Should be number if row or col are number', () => {
		expectTypeOf<Pos.GetReg<{ col: number; row: 0 }>>().toEqualTypeOf<number>()
		expectTypeOf<Pos.GetReg<{ col: 0; row: number }>>().toEqualTypeOf<number>()
		expectTypeOf<Pos.GetReg<{ col: number; row: number }>>().toEqualTypeOf<number>()
	})

	test('Should be never if row or col are less than 0', () => {
		expectTypeOf<Pos.GetReg<{ col: number; row: -1 }>>().toEqualTypeOf<never>()
		expectTypeOf<Pos.GetReg<{ col: -1; row: number }>>().toEqualTypeOf<never>()
		expectTypeOf<Pos.GetReg<{ col: -1; row: -1 }>>().toEqualTypeOf<never>()
	})

	test('Should be never if row or col are greater than 8', () => {
		expectTypeOf<Pos.GetReg<{ col: number; row: 9 }>>().toEqualTypeOf<never>()
		expectTypeOf<Pos.GetReg<{ col: 9; row: number }>>().toEqualTypeOf<never>()
		expectTypeOf<Pos.GetReg<{ col: 9; row: 9 }>>().toEqualTypeOf<never>()
	})

	test('Should be 0 literal', () => {
		expectTypeOf<Pos.GetReg<{ col: 0; row: 0 }>>().toEqualTypeOf<0>()
		expectTypeOf<Pos.GetReg<{ col: 1; row: 0 }>>().toEqualTypeOf<0>()
		expectTypeOf<Pos.GetReg<{ col: 2; row: 0 }>>().toEqualTypeOf<0>()
		expectTypeOf<Pos.GetReg<{ col: 0; row: 1 }>>().toEqualTypeOf<0>()
		expectTypeOf<Pos.GetReg<{ col: 1; row: 1 }>>().toEqualTypeOf<0>()
		expectTypeOf<Pos.GetReg<{ col: 2; row: 1 }>>().toEqualTypeOf<0>()
		expectTypeOf<Pos.GetReg<{ col: 0; row: 2 }>>().toEqualTypeOf<0>()
		expectTypeOf<Pos.GetReg<{ col: 1; row: 2 }>>().toEqualTypeOf<0>()
		expectTypeOf<Pos.GetReg<{ col: 2; row: 2 }>>().toEqualTypeOf<0>()
	})

	test('Should be 1 literal', () => {
		expectTypeOf<Pos.GetReg<{ col: 3; row: 0 }>>().toEqualTypeOf<1>()
		expectTypeOf<Pos.GetReg<{ col: 4; row: 0 }>>().toEqualTypeOf<1>()
		expectTypeOf<Pos.GetReg<{ col: 5; row: 0 }>>().toEqualTypeOf<1>()
		expectTypeOf<Pos.GetReg<{ col: 3; row: 1 }>>().toEqualTypeOf<1>()
		expectTypeOf<Pos.GetReg<{ col: 4; row: 1 }>>().toEqualTypeOf<1>()
		expectTypeOf<Pos.GetReg<{ col: 5; row: 1 }>>().toEqualTypeOf<1>()
		expectTypeOf<Pos.GetReg<{ col: 3; row: 2 }>>().toEqualTypeOf<1>()
		expectTypeOf<Pos.GetReg<{ col: 4; row: 2 }>>().toEqualTypeOf<1>()
		expectTypeOf<Pos.GetReg<{ col: 5; row: 2 }>>().toEqualTypeOf<1>()
	})

	test('Should be 2 literal', () => {
		expectTypeOf<Pos.GetReg<{ col: 6; row: 0 }>>().toEqualTypeOf<2>()
		expectTypeOf<Pos.GetReg<{ col: 7; row: 0 }>>().toEqualTypeOf<2>()
		expectTypeOf<Pos.GetReg<{ col: 8; row: 0 }>>().toEqualTypeOf<2>()
		expectTypeOf<Pos.GetReg<{ col: 6; row: 1 }>>().toEqualTypeOf<2>()
		expectTypeOf<Pos.GetReg<{ col: 7; row: 1 }>>().toEqualTypeOf<2>()
		expectTypeOf<Pos.GetReg<{ col: 8; row: 1 }>>().toEqualTypeOf<2>()
		expectTypeOf<Pos.GetReg<{ col: 6; row: 2 }>>().toEqualTypeOf<2>()
		expectTypeOf<Pos.GetReg<{ col: 7; row: 2 }>>().toEqualTypeOf<2>()
		expectTypeOf<Pos.GetReg<{ col: 8; row: 2 }>>().toEqualTypeOf<2>()
	})

	test('Should be 3 literal', () => {
		expectTypeOf<Pos.GetReg<{ col: 0; row: 3 }>>().toEqualTypeOf<3>()
		expectTypeOf<Pos.GetReg<{ col: 1; row: 3 }>>().toEqualTypeOf<3>()
		expectTypeOf<Pos.GetReg<{ col: 2; row: 3 }>>().toEqualTypeOf<3>()
		expectTypeOf<Pos.GetReg<{ col: 0; row: 4 }>>().toEqualTypeOf<3>()
		expectTypeOf<Pos.GetReg<{ col: 1; row: 4 }>>().toEqualTypeOf<3>()
		expectTypeOf<Pos.GetReg<{ col: 2; row: 4 }>>().toEqualTypeOf<3>()
		expectTypeOf<Pos.GetReg<{ col: 0; row: 5 }>>().toEqualTypeOf<3>()
		expectTypeOf<Pos.GetReg<{ col: 1; row: 5 }>>().toEqualTypeOf<3>()
		expectTypeOf<Pos.GetReg<{ col: 2; row: 5 }>>().toEqualTypeOf<3>()
	})

	test('Should be 4 literal', () => {
		expectTypeOf<Pos.GetReg<{ col: 3; row: 3 }>>().toEqualTypeOf<4>()
		expectTypeOf<Pos.GetReg<{ col: 4; row: 3 }>>().toEqualTypeOf<4>()
		expectTypeOf<Pos.GetReg<{ col: 5; row: 3 }>>().toEqualTypeOf<4>()
		expectTypeOf<Pos.GetReg<{ col: 3; row: 4 }>>().toEqualTypeOf<4>()
		expectTypeOf<Pos.GetReg<{ col: 4; row: 4 }>>().toEqualTypeOf<4>()
		expectTypeOf<Pos.GetReg<{ col: 5; row: 4 }>>().toEqualTypeOf<4>()
		expectTypeOf<Pos.GetReg<{ col: 3; row: 5 }>>().toEqualTypeOf<4>()
		expectTypeOf<Pos.GetReg<{ col: 4; row: 5 }>>().toEqualTypeOf<4>()
		expectTypeOf<Pos.GetReg<{ col: 5; row: 5 }>>().toEqualTypeOf<4>()
	})

	test('Should be 5 literal', () => {
		expectTypeOf<Pos.GetReg<{ col: 6; row: 3 }>>().toEqualTypeOf<5>()
		expectTypeOf<Pos.GetReg<{ col: 7; row: 3 }>>().toEqualTypeOf<5>()
		expectTypeOf<Pos.GetReg<{ col: 8; row: 3 }>>().toEqualTypeOf<5>()
		expectTypeOf<Pos.GetReg<{ col: 6; row: 4 }>>().toEqualTypeOf<5>()
		expectTypeOf<Pos.GetReg<{ col: 7; row: 4 }>>().toEqualTypeOf<5>()
		expectTypeOf<Pos.GetReg<{ col: 8; row: 4 }>>().toEqualTypeOf<5>()
		expectTypeOf<Pos.GetReg<{ col: 6; row: 5 }>>().toEqualTypeOf<5>()
		expectTypeOf<Pos.GetReg<{ col: 7; row: 5 }>>().toEqualTypeOf<5>()
		expectTypeOf<Pos.GetReg<{ col: 8; row: 5 }>>().toEqualTypeOf<5>()
	})

	test('Should be 6 literal', () => {
		expectTypeOf<Pos.GetReg<{ col: 0; row: 6 }>>().toEqualTypeOf<6>()
		expectTypeOf<Pos.GetReg<{ col: 1; row: 6 }>>().toEqualTypeOf<6>()
		expectTypeOf<Pos.GetReg<{ col: 2; row: 6 }>>().toEqualTypeOf<6>()
		expectTypeOf<Pos.GetReg<{ col: 0; row: 7 }>>().toEqualTypeOf<6>()
		expectTypeOf<Pos.GetReg<{ col: 1; row: 7 }>>().toEqualTypeOf<6>()
		expectTypeOf<Pos.GetReg<{ col: 2; row: 7 }>>().toEqualTypeOf<6>()
		expectTypeOf<Pos.GetReg<{ col: 0; row: 8 }>>().toEqualTypeOf<6>()
		expectTypeOf<Pos.GetReg<{ col: 1; row: 8 }>>().toEqualTypeOf<6>()
		expectTypeOf<Pos.GetReg<{ col: 2; row: 8 }>>().toEqualTypeOf<6>()
	})

	test('Should be 7 literal', () => {
		expectTypeOf<Pos.GetReg<{ col: 3; row: 6 }>>().toEqualTypeOf<7>()
		expectTypeOf<Pos.GetReg<{ col: 4; row: 6 }>>().toEqualTypeOf<7>()
		expectTypeOf<Pos.GetReg<{ col: 5; row: 6 }>>().toEqualTypeOf<7>()
		expectTypeOf<Pos.GetReg<{ col: 3; row: 7 }>>().toEqualTypeOf<7>()
		expectTypeOf<Pos.GetReg<{ col: 4; row: 7 }>>().toEqualTypeOf<7>()
		expectTypeOf<Pos.GetReg<{ col: 5; row: 7 }>>().toEqualTypeOf<7>()
		expectTypeOf<Pos.GetReg<{ col: 3; row: 8 }>>().toEqualTypeOf<7>()
		expectTypeOf<Pos.GetReg<{ col: 4; row: 8 }>>().toEqualTypeOf<7>()
		expectTypeOf<Pos.GetReg<{ col: 5; row: 8 }>>().toEqualTypeOf<7>()
	})

	test('Should be 8 literal', () => {
		expectTypeOf<Pos.GetReg<{ col: 6; row: 6 }>>().toEqualTypeOf<8>()
		expectTypeOf<Pos.GetReg<{ col: 7; row: 6 }>>().toEqualTypeOf<8>()
		expectTypeOf<Pos.GetReg<{ col: 8; row: 6 }>>().toEqualTypeOf<8>()
		expectTypeOf<Pos.GetReg<{ col: 6; row: 7 }>>().toEqualTypeOf<8>()
		expectTypeOf<Pos.GetReg<{ col: 7; row: 7 }>>().toEqualTypeOf<8>()
		expectTypeOf<Pos.GetReg<{ col: 8; row: 7 }>>().toEqualTypeOf<8>()
		expectTypeOf<Pos.GetReg<{ col: 6; row: 8 }>>().toEqualTypeOf<8>()
		expectTypeOf<Pos.GetReg<{ col: 7; row: 8 }>>().toEqualTypeOf<8>()
		expectTypeOf<Pos.GetReg<{ col: 8; row: 8 }>>().toEqualTypeOf<8>()
	})
})
