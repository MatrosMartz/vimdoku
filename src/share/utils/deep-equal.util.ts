import { keysBy } from './commons.util'
import * as Protocol from './protocols.util'

/**
 * Checks if value is function or object.
 * @param a The any value.
 * @returns True if value is function or object, false otherwise.
 */
function isFuncOrObjType(a: unknown): a is object {
	return typeof a === 'function' || typeof a === 'object'
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
		if (!isFuncOrObjType(currA) || !isFuncOrObjType(currB)) return currA === currB
		if (Protocol.implementsEquals(currA)) return currA[Protocol.equalsTo](currB)
		if (Protocol.implementsEquals(currB)) return currB[Protocol.equalsTo](currA)

		const [keysA, keysB] = [keysBy(currA), keysBy(currB)]
		if (keysA.length !== keysB.length) return false
		for (const key of keysA) {
			if (!Object.hasOwn(currB, key)) return false
			stack.push([currA[key], currB[key]])
		}
	}

	return false
}
