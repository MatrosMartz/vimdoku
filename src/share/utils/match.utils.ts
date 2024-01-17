/**
 * Matches the key of the object that is equal to the value.
 * @param value The value to be matched.
 * @param cases The object with the functions to be executed if its keys match the submitted value.
 * @returns The execution of the function with which it coincided.
 */
export function match<V extends string | number | symbol, R = void>(value: V, cases: Record<V, () => R>): R {
	return cases[value]()
}
