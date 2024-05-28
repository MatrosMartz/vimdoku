import type { Class, IsBigType, Numeric, Primitives, ReadonlyRecord, SetLike, StrToType, StrTypes } from '../types'
import { entriesBy } from './commons.util'
import { createArray } from './create-array.util'

const excludeKey = Symbol('exclude')
const typeKey = Symbol('type')

type GetExclude<T extends FnData> = T[typeof excludeKey]
type GetType<T extends FnData> = T[typeof typeKey]

export type Match<T, U extends FnData> = IfExclude<U, Exclude<T, GetType<U>>, Extract<T, GetType<U>>>

export type ExcludeEmpty<T> =
	// T[keyof T] extends never ? never : T
	T extends infer U ? (true extends { [K in keyof U]: U[K] extends never ? true : false }[keyof U] ? never : U) : never

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
								: Extract<T[K], U[K]>
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
							: never
						: never
				: T extends Primitives
					? never
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

export interface InvertFnData<Data extends FnData> {
	[excludeKey]: IfExclude<Data, false, true>
	[typeKey]: Data[typeof typeKey]
}

export type Fn<Data extends FnData> = <const T>(value: T) => value is Match<T, Data> extends T ? Match<T, Data> : never

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

type GetData<T> = T extends Assert<infer Data> ? Data : never

export const equalTo = <const Options extends unknown[]>(...options: Options) =>
	new Assert<FnData<Options[number]>>(val => options.some(option => val === option))

export const typeOf = <const Types extends StrTypes[]>(...types: Types) =>
	new Assert<FnData<StrToType<Types[number]>>>(val => {
		if (typeof val === 'object') {
			if (types.includes('null') && val === null) return true
			if (types.includes('object') && val !== null) return true
			return false
		}
		return types.includes(typeof val)
	})

export const match = (regex: RegExp) => new Assert<FnData<string>>(val => typeof val === 'string' && regex.test(val))

export const startWith = <const S extends string>(str: S) =>
	new Assert<FnData<`${S}${string}`>>(val => typeof val === 'string' && val.startsWith(str))

export const fromGuard = <Guard>(fn: (val: unknown) => val is Guard) => new Assert<FnData<Guard>>(fn)

export type ArrayWith<Length extends number, Data extends FnData, Arr extends unknown[] = []> =
	IsBigType<Length> extends true
		? never
		: Arr['length'] extends Length
			? readonly [...Arr, Data, ...Array<unknown>]
			: ArrayWith<Length, Data, [...Arr, unknown]>

class AssertArray extends Assert<FnData<readonly unknown[]>> {
	constructor() {
		super(Array.isArray)
	}

	equalTo<const Items extends Array<Assert<FnData>>>(items: Items) {
		return new Assert<FnData<{ readonly [K in keyof Items]: GetData<Items[K]> }>>(val => {
			if (!Array.isArray(val) || val.length !== items.length) return false
			return items.every((assert, index) => assert.fn(val[index]))
		})
	}

	with<const Index extends number, Data extends FnData>(index: Index, item: Assert<Data>) {
		return new Assert<FnData<ArrayWith<Index, Data>>>(val => Array.isArray(val) && item.fn(val[index]))
	}
}

class AssertObject extends Assert<FnData<object>> {
	constructor() {
		super(val => val != null && ['object', 'function'].includes(typeof val))
	}

	equalTo<const Props extends ReadonlyRecord<PropertyKey, Assert<FnData>>>(properties: Props) {
		return new Assert<FnData<{ readonly [K in keyof Props]: GetData<Props[K]> }>>(val => {
			if (val == null || typeof val !== 'object') return false
			const propEntries = entriesBy(properties)
			if (propEntries.length !== Object.keys(val).length) return false
			return propEntries.every(([key, assert]) => key in val && assert.fn(Reflect.get(val, key)))
		})
	}

	with<Key extends PropertyKey, Data extends FnData>(key: Key, assert: Assert<Data>) {
		return new Assert<FnData<ReadonlyRecord<Key, Data>>>(val => {
			if (typeof val !== 'object' || val == null) return false
			if (!(key in val)) return false
			return assert.fn(Reflect.get(val, key))
		})
	}

	withKey<Keys extends PropertyKey[]>(...keys: Keys) {
		return new Assert<FnData<ReadonlyRecord<Keys[number], unknown>>>(val => {
			if (typeof val !== 'object' || val == null) return false
			return keys.every(Object.hasOwn.bind(null, val))
		})
	}
}

/**
 * Checks if value is of type number or bigint.
 * @param val The unknown value.
 * @returns True if are Numeric, false otherwise.
 */
function isNumeric(val: unknown): val is Numeric {
	return ['number', 'bigint'].includes(typeof val)
}

class AssertNumeric extends Assert<FnData<Numeric>> {
	constructor() {
		super(isNumeric)
	}

	gt(x: Numeric) {
		return new Assert<FnData<Numeric>>(val => isNumeric(val) && x < val)
	}

	gte(x: Numeric) {
		return new Assert<FnData<Numeric>>(val => isNumeric(val) && x <= val)
	}

	inRange(x: Numeric, y: Numeric) {
		return new Assert<FnData<Numeric>>(val => {
			if (!isNumeric(val)) return false
			const [min, max] = x < y ? [x, y] : [y, x]
			return min <= val && val <= max
		})
	}

	lt(x: Numeric) {
		return new Assert<FnData<Numeric>>(val => isNumeric(val) && x > val)
	}

	lte(x: Numeric) {
		return new Assert<FnData<Numeric>>(val => isNumeric(val) && x >= val)
	}
}

interface Is {
	<const Classes extends ReadonlyArray<Class<object>>>(
		...classes: Classes
	): Assert<FnData<Classes[number] extends Class<infer I> ? I : never>>
	Any: Assert<FnData<unknown>>
	Array: AssertArray
	Map: Assert<FnData<ReadonlyMap<unknown, unknown>>>
	Nullable: Assert<FnData<null | undefined>>
	Numeric: AssertNumeric
	Object: AssertObject
	PropertyKey: Assert<FnData<PropertyKey>>
	Set: Assert<FnData<ReadonlySet<unknown>>>
	SetLike: Assert<FnData<SetLike>>
}

const is: Is = (...classes) => new Assert(val => classes.some(C => val instanceof C))
is.Any = new Assert(() => true)
is.Array = new AssertArray()
is.Map = new Assert(val => val instanceof Map)
is.Nullable = new Assert(val => val == null)
is.Numeric = new AssertNumeric()
is.Object = new AssertObject()
is.PropertyKey = typeOf('string', 'symbol', 'number')
is.Set = new Assert(val => val instanceof Set)
is.SetLike = is.Map.or(is.Set)

export { is }

export const not = <Data extends FnData>(assert: Assert<Data>) => new Assert<InvertFnData<Data>>(val => !assert.fn(val))
