import { xor } from './commons.util'

export function sameStructure(obj1: unknown, obj2: unknown) {
	if (typeof obj1 !== 'object' || obj1 == null) return obj1 === obj2
	if (typeof obj2 !== 'object' || obj2 == null) return false
	if (xor(Array.isArray(obj1), Array.isArray(obj2))) return false

	const [keys1, keys2] = [Object.keys(obj1), Object.keys(obj2)]

	if (keys1.length !== keys2.length) return false

	for (const key of keys1) {
		if (!keys2.includes(key)) return false

		const value1 = (obj1 as Record<string, unknown>)[key]
		const value2 = (obj2 as Record<string, unknown>)[key]
		if (xor(Array.isArray(value1), Array.isArray(value2))) return false
		if (xor(value1 == null, value2 == null)) return false

		if (!sameStructure(value1, value2)) return false
	}

	return true
}
