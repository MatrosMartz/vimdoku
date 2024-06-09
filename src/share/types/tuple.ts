export type IsInteger<N extends number> = `${N}` extends `${number}.${number}` ? false : true

export type IsUnsigned<N extends number> = `${N}` extends `-${number}` ? false : true

export type IsNumberType<N extends number> = number extends N ? true : false

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type IsBigType<N extends number> = `${N}` extends `${Digit | ''}${Digit}` ? false : true

export type Tuple<T, N extends number, L extends T[] = []> =
	IsNumberType<N> extends true
		? T[]
		: IsInteger<N> extends false
			? never
			: IsUnsigned<N> extends false
				? never
				: IsBigType<N> extends true
					? never
					: L['length'] extends N
						? L
						: Tuple<T, N, [T, ...L]>

/* export type Tuple<T, N extends number> =
	IsNumberType<N> extends true
		? T[]
		: IsInteger<N> extends false
			? never
			: IsUnsigned<N> extends false
				? never
				: T[] & { length: N } */

export type ReadonlyTuple<T, N extends number, L extends readonly T[] = []> =
	IsNumberType<N> extends true
		? readonly T[]
		: IsInteger<N> extends false
			? never
			: IsUnsigned<N> extends false
				? never
				: IsBigType<N> extends true
					? never
					: L['length'] extends N
						? L
						: ReadonlyTuple<T, N, readonly [T, ...L]>

/* export type ReadonlyTuple<T, N extends number> =
	IsNumberType<N> extends true
		? readonly T[]
		: IsInteger<N> extends false
			? never
			: IsUnsigned<N> extends false
				? never
				: readonly T[] & { length: N } */
