type RangeTo<N extends number, L extends number[] = []> =
	IsInteger<N> extends false
		? never
		: IsUnsigned<N> extends false
			? never
			: L['length'] extends N
				? L[number] | N
				: RangeTo<N, [...L, L['length']]>

export type Range<Min extends number, Max extends number> = Exclude<RangeTo<Max>, RangeTo<Min>>
