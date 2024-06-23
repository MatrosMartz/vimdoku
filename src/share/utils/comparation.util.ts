import { keysBy } from './commons.util'
import * as Guard from './guards.util'
import * as Prtcl from './protocols'

/**
 * Checks if two values are equals.
 * @param a First value.
 * @param b Second value.
 * @param [props] Props to compare.
 * @returns True if both values are equals, false otherwise.
 */
export function equals(a: unknown, b: unknown, props?: PropertyKey | readonly [PropertyKey, ...PropertyKey[]]) {
	if (props != null && Guard.isObject(a) && Guard.isObject(b)) {
		const p = Guard.isArray(props) ? props : ([props] as const)
		for (const prop of p) {
			if (!(Guard.in(a, prop) || Guard.in(b, prop))) return false
			if (!internalEquals(a[prop], b[prop])) return false
		}

		return true
	}
	return internalEquals(a, b)
}

/**
 * Checks if the two values are related.
 * @param a First value.
 * @param b Second value.
 * @returns True if both are related, false otherwise.
 */
export function related(a: unknown, b: unknown) {
	if (Prtcl.impl('related', a) && Guard.isObject(b)) return a[Prtcl.relatedProps].some(prop => equals(a[prop], b[prop]))
	if (Prtcl.impl('related', b) && Guard.isObject(a)) return b[Prtcl.relatedProps].some(prop => equals(b[prop], a[prop]))

	return equals(a, b)
}

/**
 * Use for checks if two values are equals (only internal).
 * @param a First value.
 * @param b Second value.
 * @returns True if both values are equals, false otherwise.
 */
function internalEquals(a: unknown, b: unknown) {
	if (Prtcl.impl('equals', a)) return a[Prtcl.equalsTo](b)
	if (Prtcl.impl('equals', b)) return b[Prtcl.equalsTo](a)
	if (Number.isNaN(a) && Number.isNaN(b)) return true
	return a === b
}

/**
 * Comparate in deepth two objects.
 * @param a Any object.
 * @param b Any object.
 * @returns True if two object are equals, false otherwise.
 */
export function deepEquals(a: unknown, b: unknown) {
	const stack: Array<[unknown, unknown]> = [[a, b]]

	while (stack.length > 0) {
		const [currA, currB] = stack.pop()!

		if (Number.isNaN(currA) && Number.isNaN(currB)) return true
		if (!Guard.isObject(currA) || !Guard.isObject(currB)) return currA === currB
		if (Prtcl.impl('equals', currA)) return currA[Prtcl.equalsTo](currB)
		if (Prtcl.impl('equals', currB)) return currB[Prtcl.equalsTo](currA)

		const [keysA, keysB] = [keysBy(currA), keysBy(currB)]
		if (keysA.length !== keysB.length) return false
		for (const key of keysA) {
			if (!Object.hasOwn(currB, key)) return false
			stack.push([currA[key], currB[key]])
		}
	}

	return false
}
