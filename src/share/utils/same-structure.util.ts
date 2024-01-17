import { xor } from './commons.util'

/**
 * Comprares the structure of two objects (iterative way).
 * @param obj1 The first object.
 * @param obj2 The second object.
 * @returns The result of the comparative.
 */
export function sameStructureIterative(obj1: unknown, obj2: unknown) {
	const [type1, type2] = [typeof obj1, typeof obj2]

	if (type1 !== 'object' || type2 !== 'object') return type1 === type2
	if (obj1 == null || obj2 == null) return obj1 === obj2
	if (Array.isArray(obj1) !== Array.isArray(obj2)) return false

	const [keys1, keys2] = [Object.keys(obj1), Object.keys(obj2)]

	if (keys1.length !== keys2.length) return false

	for (const key of keys1) {
		if (!keys2.includes(key)) return false

		const value1 = (obj1 as Record<string, unknown>)[key]
		const value2 = (obj2 as Record<string, unknown>)[key]
		if (xor(Array.isArray(value1), Array.isArray(value2))) return false
		if (xor(value1 == null, value2 == null)) return false

		if (!sameStructureIterative(value1, value2)) return false
	}

	return true
}

type Obj = Record<string | number, unknown>

/**
 * Comprares the structure of two objects (loop1 way).
 * @param obj1 The first object.
 * @param obj2 The second object.
 * @returns The result of the comparative.
 */
export function sameStructureLoop(obj1: unknown, obj2: unknown) {
	const [stack1, stack2] = [[obj1 as Obj], [obj2 as Obj]]

	while (stack1.length > 0 && stack2.length > 0) {
		const [curr1, curr2] = [stack1.pop()!, stack2.pop()!]
		const [type1, type2] = [typeof curr1, typeof curr2]

		if (type1 !== type2) return false
		if ((curr1 == null) !== (curr2 == null)) return false

		if (Array.isArray(curr1) !== Array.isArray(curr2)) return false

		if (type1 !== 'object' || curr1 == null) continue

		const [keys1, keys2] = [Object.keys(curr1), Object.keys(curr2)]

		if (keys1.length !== keys2.length) return false

		for (const key of keys1) {
			if (!keys2.includes(key)) return false

			stack1.push(curr1[key] as Obj)
			stack2.push(curr2[key] as Obj)
		}
	}

	return true
}

/**
 * Comprares the structure of two objects.
 * @param obj1 The first object.
 * @param obj2 The second object.
 * @returns The result of the comparative.
 */
export function sameStructureLoop2(obj1: unknown, obj2: unknown) {
	const [type1, type2] = [typeof obj1, typeof obj2]
	if (type1 !== type2 || (obj1 == null) !== (obj2 == null) || Array.isArray(obj1) !== Array.isArray(obj2)) return false

	if (type1 !== 'object' || obj1 == null) return true

	const stack = [[obj1, obj2]] as Array<[Obj, Obj]>

	while (stack.length > 0) {
		const [curr1, curr2] = stack.pop()!

		const [keys1, keys2] = [Object.keys(curr1), Object.keys(curr2)]

		if (keys1.length !== keys2.length) return false

		for (const key of keys1) {
			if (!keys2.includes(key)) return false

			const [val1, val2] = [curr1[key], curr2[key]]
			const [type1, type2] = [typeof val1, typeof val2]

			if (type1 !== type2 || (val1 == null) !== (val2 == null) || Array.isArray(val1) !== Array.isArray(val2))
				return false

			if (type1 !== 'object' || val1 == null) continue

			stack.push([val1, val2] as [Obj, Obj])
		}
	}

	return true
}

export default sameStructureLoop2
