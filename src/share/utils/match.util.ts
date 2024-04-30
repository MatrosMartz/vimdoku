import type { StrToType, StrTypes } from '../types'
import { entriesBy, noop } from './commons.util'

export type CaseAssert<T> = (value: unknown) => value is T

export class Case<T> {
	static readonly Any = new Case((val): val is unknown => true)
	static readonly Array = new Case((val): val is readonly unknown[] => Array.isArray(val))
	static readonly Map = new Case((val): val is ReadonlyMap<unknown, unknown> => val instanceof Map)
	static readonly PropertyKey = Case.typeOf('string').union(Case.typeOf('symbol'), Case.typeOf('number'))

	static readonly Set = new Case((val): val is ReadonlySet<unknown> => val instanceof Set)

	static readonly SetLike = Case.Set.union(Case.Map)

	readonly #assert

	constructor(assert: CaseAssert<T>) {
		this.#assert = assert
	}

	get assert() {
		return this.#assert
	}

	static array<const Arr extends ReadonlyArray<Case<any>>>(arrCases: Arr) {
		type Assert = { readonly [K in keyof Arr]: Arr[K] extends Case<infer A> ? A : never }
		return new Case((val): val is Assert => Case.Array.assert(val) && arrCases.every((c, i) => c.assert(val[i])))
	}

	static equalTo<const T>(...values: T[]) {
		return new Case((val): val is T => values.includes(val as never))
	}

	static fromRegex(rgx: RegExp) {
		return new Case((val): val is string => typeof val === 'string' && rgx.test(val))
	}

	static not<const T>(_case: Case<T>) {
		return new Case((val): val is Exclude<unknown, Extract<unknown, T>> => !_case.assert(val))
	}

	static object<Obj extends Record<PropertyKey, Case<unknown>>>(objCases: Obj) {
		type Assert = { readonly [K in keyof Obj]: Obj[K] extends Case<infer A> ? A : never }
		return new Case((obj): obj is Assert => {
			if (typeof obj !== 'object' || obj == null) return false
			for (const [key, value] of entriesBy(objCases))
				if (!(key in obj) || !value.assert(Reflect.get(obj, key))) return false
			return true
		})
	}

	static startWith<Search extends string>(searchString: Search) {
		return new Case((val): val is `${Search}${string}` => {
			if (typeof val !== 'string') return false
			return val.startsWith(searchString)
		})
	}

	static typeOf<S extends StrTypes>(type: S) {
		return new Case((val): val is StrToType<S> => {
			const valType = typeof val
			if (type === 'null') return val == null
			return valType === type
		})
	}

	union<O extends ReadonlyArray<Case<unknown>>>(...others: O) {
		type OT = O[number] extends Case<infer U> ? U : never

		return new Case((val): val is T | OT => this.assert(val) || others.some(({ assert }) => assert(val)))
	}
}

export type MatchFunc<T extends readonly any[], R> = (...value: T) => R
export type MatchCase<T extends readonly any[], R> = [CaseAssert<T>, MatchFunc<T, R>]

export type MergeArgs<T extends readonly any[], C extends ReadonlyArray<Case<unknown>>> = {
	[K in keyof T]: K extends keyof C
		? C[K] extends Case<infer U>
			? Extract<T[K], U> extends never
				? T[K] & U
				: Extract<T[K], U>
			: never
		: never
}

export class BuildMatcher<T extends readonly any[], R> {
	#defaultFn: (...val: T) => R = noop as never
	readonly #list: Array<MatchCase<T, R>> = []

	addCase<const C extends ReadonlyArray<Case<unknown>>>(casesArr: C, fn: MatchFunc<MergeArgs<T, C>, R>) {
		this.#list.push([Case.array(casesArr).assert, fn] as never)
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
