import type { Class, StrToType, StrTypes } from '../types'
import { entriesBy } from './commons.util'

export type AssertFn<T> = (val: unknown) => val is T

export class Assert<T> {
	constructor(readonly fn: AssertFn<T>) {}

	static equalTo<const T>(...values: T[]) {
		return new Assert((val): val is T => values.includes(val as never))
	}

	static fromRegex(rgx: RegExp) {
		return new Assert((val): val is string => typeof val === 'string' && rgx.test(val))
	}

	static is<Classes extends ReadonlyArray<Class<object>>>(...classes: Classes) {
		type ClassType = Classes[number] extends Class<infer I> ? I : never
		return new Assert((val): val is ClassType => classes.some(Class => val instanceof Class))
	}

	static object<Obj extends Record<PropertyKey, Assert<unknown>>>(objCases: Obj) {
		type ObjectType = { readonly [K in keyof Obj]: Obj[K] extends Assert<infer A> ? A : never }
		return new Assert((obj): obj is ObjectType => {
			if (typeof obj !== 'object' || obj == null) return false
			for (const [key, { fn }] of entriesBy(objCases)) if (!(key in obj) || !fn(Reflect.get(obj, key))) return false
			return true
		})
	}

	static range({ max, min }: { max: number | bigint; min: number | bigint }) {
		return new Assert((val): val is number | bigint => {
			if (!AssertCommons.Numeric.fn(val)) return false
			return min <= val && val <= max
		})
	}

	static startWith<Search extends string>(searchString: Search) {
		return new Assert((val): val is `${Search}${string}` => {
			if (typeof val !== 'string') return false
			return val.startsWith(searchString)
		})
	}

	static tuple<const Arr extends ReadonlyArray<Assert<any>>>(arrCases: Arr) {
		type ArrayType = { readonly [K in keyof Arr]: Arr[K] extends Assert<infer A> ? A : never }
		return new Assert(
			(val): val is ArrayType => AssertCommons.Array.fn(val) && arrCases.every(({ fn }, i) => fn(val[i]))
		)
	}

	static typeOf<S extends readonly StrTypes[]>(...types: S) {
		return new Assert((val): val is StrToType<S[number]> => {
			const valType = typeof val
			if (types.includes('null')) return val == null
			return types.includes(valType)
		})
	}

	union<Others extends ReadonlyArray<Assert<unknown>>>(...others: Others) {
		type OthersAssertion = Others[number] extends Assert<infer U> ? U : never
		return new Assert((val): val is T | OthersAssertion => this.fn(val) || others.some(({ fn }) => fn(val)))
	}
}

export const AssertCommons = {
	Any: new Assert((val): val is unknown => true),
	Array: new Assert<readonly unknown[]>(Array.isArray),
	Map: Assert.is(Map) as Assert<ReadonlyMap<unknown, unknown>>,
	Set: Assert.is(Set) as Assert<ReadonlySet<unknown>>,
	Collection: Assert.is(Map, Set) as Assert<ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>>,
	Numeric: Assert.typeOf('number', 'bigint'),
	PropertyKey: Assert.typeOf('string', 'symbol', 'number'),
} as const
