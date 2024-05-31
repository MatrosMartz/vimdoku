import type { Primitives } from '~/share/types'

import { createArray } from '../create-array.util'

const excludeKey = Symbol('exclude')
const typeKey = Symbol('type')

type GetExclude<T extends FnData> = T[typeof excludeKey]
type GetType<T extends FnData> = T[typeof typeKey]

export type ExcludeEmpty<T> = T extends infer U
	? true extends { [K in keyof U]: U[K] extends never ? true : false }[keyof U]
		? never
		: U
	: never

type A<T, U> = ExcludeEmpty<
	readonly unknown[] extends T
		? {
				[K in keyof U]: U[K] extends FnData ? (GetExclude<U[K]> extends true ? unknown : GetType<U[K]>) : U[K]
			}
		: unknown[] extends T
			? {
					-readonly [K in keyof U]: U[K] extends FnData
						? GetExclude<U[K]> extends true
							? unknown
							: GetType<U[K]>
						: U[K]
				}
			: {
					[K in keyof T]: K extends keyof U
						? U[K] extends FnData
							? IfExclude<U[K], Exclude<T[K], GetType<U[K]>>, Extract<T[K], GetType<U[K]>>>
							: unknown extends T[K]
								? U[K]
								: T[K] extends FnData
									? Extract<GetType<T[K]>, U[K]>
									: Extract<T[K], U[K]>
						: T[K] extends FnData
							? never
							: T[K]
				}
>

export type Get<T, U extends FnData> = globalThis.Extract<
	IfExclude<U, Exclude<T, GetType<U>>, Extract<T, GetType<U>>>,
	T
>

type IfExclude<T extends FnData, IfTrue, IfFalse> = GetExclude<T> extends true ? IfTrue : IfFalse

export type Extract<T, U> =
	globalThis.Extract<T, U> extends never
		? unknown extends T
			? U extends Primitives
				? U
				: {
						[K in keyof U]: U[K] extends FnData ? IfExclude<U[K], unknown, GetType<U[K]>> : U[K]
					}
			: U extends T
				? U extends Primitives
					? U
					: T extends infer V
						? keyof U extends keyof V
							? A<V, U>
							: A<U, V>
						: never
				: T extends Primitives
					? U extends `${infer V}`
						? T & V
						: never
					: A<T, U>
		: globalThis.Extract<T, U>

export type B<T, U, IsNever extends boolean> = U extends FnData
	? IfExclude<
			U,
			Extract<T, GetType<U>>,
			unknown extends GetType<U> ? (IsNever extends true ? never : T) : Exclude<T, GetType<U>>
		>
	: Exclude<T, U>

export type Exclude<T, U> = T extends U
	? never
	: unknown extends T
		? unknown
		: T extends Primitives
			? globalThis.Exclude<T, U>
			: U extends T
				? U[keyof U] extends FnData
					? ExcludeEmpty<{
							[K in keyof T]: K extends keyof U ? B<T[K], U[K], true> : T[K]
						}>
					: globalThis.Exclude<T, U>
				: T extends globalThis.Exclude<T, U>
					? keyof U extends keyof T
						? ExcludeEmpty<{
								[K in keyof T]: K extends keyof U ? (T[K] extends U[K] ? T[K] : B<T[K], U[K], false>) : T[K]
							}>
						: T
					: globalThis.Exclude<T, U>

export interface FnData<T = any> {
	[excludeKey]: boolean
	[typeKey]: T
}

export interface Not<Data extends FnData> {
	[excludeKey]: IfExclude<Data, false, true>
	[typeKey]: Data[typeof typeKey]
}

export type Fn<Data extends FnData> = <const T>(value: T) => value is Get<T, Data>

export type Predicate = <T = unknown>(value: T) => boolean

export type Union<Asserts extends readonly unknown[]> = GetData<Asserts[number]>

export class Assert<Data extends FnData> {
	readonly fn: Fn<Data>

	constructor(fn: Predicate) {
		this.fn = fn as never
	}

	or<const Others extends Array<Assert<FnData>>>(...others: Others) {
		return new Assert<Data | Union<Others>>(val => this.fn(val) || others.some(other => other.fn(val)))
	}

	repeat<Times extends number>(times: Times) {
		return createArray(times, () => this)
	}
}

export type GetData<T> = T extends Assert<infer Data> ? Data : never
