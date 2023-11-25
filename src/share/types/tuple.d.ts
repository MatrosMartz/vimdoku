type IsInteger<N extends number> = `${N}` extends `${number}.${number}` ? false : true

type IsUnsigned<N extends number> = `${N}` extends `-${number}` ? false : true

type IsNumberType<N extends number> = number extends N ? true : false

/* export type Tuple<T, N extends number, L extends T[] = []> = IsNumberType<N> extends true
	? T[]
	: IsInteger<N> extends false
	? never
	: IsUnsigned<N> extends false
	? never
	: L['length'] extends N
	? L
	: Tuple<T, N, [T, ...L]> */

export type Tuple<T, N extends number> = IsNumberType<N> extends true
	? T[]
	: IsInteger<N> extends false
	  ? never
	  : IsUnsigned<N> extends false
	    ? never
	    : T[] & { length: N }

/* export type ReadonlyTuple<T, N extends number, L extends readonly T[] = []> = IsNumberType<N> extends true
	? readonly T[]
	: IsInteger<N> extends false
	? never
	: IsUnsigned<N> extends false
	? never
	: L['length'] extends N
	? L
	: ReadonlyTuple<T, N, readonly [T, ...L]> */

export type ReadonlyTuple<T, N extends number> = IsNumberType<N> extends true
	? readonly T[]
	: IsInteger<N> extends false
	  ? never
	  : IsUnsigned<N> extends false
	    ? never
	    : readonly T[] & { length: N }
