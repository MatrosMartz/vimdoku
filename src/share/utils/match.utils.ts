export function match<V extends string | number | symbol, R = void>(value: V, cases: Record<V, () => R>): R {
	return cases[value]()
}
