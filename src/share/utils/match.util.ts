import type { Class, StrToType, StrTypes } from '../types'
import { entriesBy, noop } from './commons.util'

export type AssertFn<T> = (value: unknown) => value is T

export class Assert<T> {
	static readonly Any = new Assert((val): val is unknown => true)
	static readonly Array = new Assert((val): val is readonly unknown[] => Array.isArray(val))
	static readonly Map = Assert.is(Map)
	static readonly Numeric = Assert.typeOf('number').union(Assert.typeOf('bigint'))
	static readonly PropertyKey = Assert.typeOf('string').union(Assert.typeOf('symbol'), Assert.typeOf('number'))
	static readonly Set = Assert.is(Set)
	static readonly SetLike = Assert.Set.union(Assert.Map)

	readonly #assert

	constructor(assert: AssertFn<T>) {
		this.#assert = assert
	}

	get assert() {
		return this.#assert
	}

	static array<const Arr extends ReadonlyArray<Assert<any>>>(arrCases: Arr) {
		type ArrayType = { readonly [K in keyof Arr]: Arr[K] extends Assert<infer A> ? A : never }
		return new Assert((val): val is ArrayType => Assert.Array.assert(val) && arrCases.every((c, i) => c.assert(val[i])))
	}

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

	static not<const T>(_case: Assert<T>) {
		return new Assert((val): val is Exclude<unknown, Extract<unknown, T>> => !_case.assert(val))
	}

	static object<Obj extends Record<PropertyKey, Assert<unknown>>>(objCases: Obj) {
		type ObjectType = { readonly [K in keyof Obj]: Obj[K] extends Assert<infer A> ? A : never }
		return new Assert((obj): obj is ObjectType => {
			if (typeof obj !== 'object' || obj == null) return false
			for (const [key, value] of entriesBy(objCases))
				if (!(key in obj) || !value.assert(Reflect.get(obj, key))) return false
			return true
		})
	}

	static range({ max, min }: { max: number | bigint; min: number | bigint }) {
		return new Assert((val): val is number | bigint => {
			if (!Assert.Numeric.assert(val)) return false
			return min <= val && val <= max
		})
	}

	static startWith<Search extends string>(searchString: Search) {
		return new Assert((val): val is `${Search}${string}` => {
			if (typeof val !== 'string') return false
			return val.startsWith(searchString)
		})
	}

	static typeOf<S extends StrTypes>(type: S) {
		return new Assert((val): val is StrToType<S> => {
			const valType = typeof val
			if (type === 'null') return val == null
			return valType === type
		})
	}

	union<Others extends ReadonlyArray<Assert<unknown>>>(...others: Others) {
		type OthersType = Others[number] extends Assert<infer U> ? U : never

		return new Assert((val): val is T | OthersType => this.assert(val) || others.some(({ assert }) => assert(val)))
	}
}

export type MatchFunc<T extends readonly any[], R> = (...value: T) => R
export type MatchCase<T extends readonly any[], R> = [AssertFn<T>, MatchFunc<T, R>]

export type MergeArgs<T extends readonly any[], C extends Assert<readonly unknown[]>> =
	C extends Assert<infer U>
		? {
				[K in keyof T]: K extends keyof U
					? Extract<T[K], U[K]> extends never
						? T[K] & U[K]
						: Extract<T[K], U[K]>
					: never
			}
		: never

export class BuildMatcher<T extends readonly any[], R> {
	#defaultFn: (...val: T) => R = noop as never
	readonly #list: Array<MatchCase<T, R>> = []

	addCase<const C extends Assert<readonly unknown[]>>(casesArr: C, fn: MatchFunc<MergeArgs<T, C>, R>) {
		this.#list.push([casesArr.assert, fn] as never)
		return this
	}

	default(fn: (...val: T) => R) {
		this.#defaultFn = fn
		return this
	}

	done() {
		return (...val: T) => {
			return this.#list.find(([assert]) => assert(val))?.[1](...val) ?? this.#defaultFn(...val)
		}
	}
}
