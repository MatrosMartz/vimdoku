import type { Class, IsBigType, Numeric, ReadonlyRecord, SetLike } from '~/share/types'

import { entriesBy } from '../commons.util'
import { typeOf } from './commons.util'
import { Assert, type FnData, type GetData } from './core.util'

export type ArrayWith<Length extends number, Data extends FnData, Arr extends unknown[] = []> =
	IsBigType<Length> extends true
		? never
		: Arr['length'] extends Length
			? readonly [...Arr, Data, ...unknown[]]
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

class AssertString extends Assert<FnData<string>> {
	constructor() {
		super(val => typeof val === 'string')
	}

	endWith<const S extends string>(str: S) {
		return new Assert<FnData<`${string}${S}`>>(val => typeof val === 'string' && val.endsWith(str))
	}

	match(regex: RegExp) {
		return new Assert<FnData<string>>(val => typeof val === 'string' && regex.test(val))
	}

	startWith<const S extends string>(str: S) {
		return new Assert<FnData<`${S}${string}`>>(val => typeof val === 'string' && val.startsWith(str))
	}
}

interface Is {
	<const Classes extends ReadonlyArray<Class<object>>>(
		...classes: Classes
	): Assert<FnData<Classes[number] extends Class<infer I> ? I : never>>
	Any: Assert<FnData<unknown>>
	Array: AssertArray
	Bigint: Assert<FnData<bigint>>
	Boolean: Assert<FnData<boolean>>
	Function: Assert<FnData<(...args: readonly any[]) => any>>
	Map: Assert<FnData<ReadonlyMap<unknown, unknown>>>
	Null: Assert<FnData<null>>
	Nullable: Assert<FnData<null | undefined>>
	Number: Assert<FnData<number>>
	Numeric: AssertNumeric
	Object: AssertObject
	PropertyKey: Assert<FnData<PropertyKey>>
	Set: Assert<FnData<ReadonlySet<unknown>>>
	SetLike: Assert<FnData<SetLike>>
	String: AssertString
	Symbol: Assert<FnData<symbol>>
	Undefined: Assert<FnData<undefined>>
}

const is: Is = (...classes) => new Assert(val => classes.some(C => val instanceof C))
is.Any = new Assert(() => true)
is.Array = new AssertArray()
is.Bigint = new Assert(val => typeof val === 'bigint')
is.Boolean = new Assert(val => typeof val === 'boolean')
is.Function = new Assert(val => typeof val === 'function')
is.Map = new Assert(val => val instanceof Map)
is.Null = new Assert(val => val === null)
is.Nullable = new Assert(val => val == null)
is.Number = new Assert(val => typeof val === 'number')
is.Numeric = new AssertNumeric()
is.Object = new AssertObject()
is.PropertyKey = typeOf('string', 'symbol', 'number')
is.Set = new Assert(val => val instanceof Set)
is.SetLike = is.Map.or(is.Set)
is.String = new AssertString()
is.Symbol = new Assert(val => typeof val === 'symbol')
is.Undefined = new Assert(val => val === undefined)

export { is }
