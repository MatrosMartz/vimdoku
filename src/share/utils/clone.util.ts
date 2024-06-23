import * as Prtcl from './protocols'

/**
 * Create clone of object.
 * @param obj The object.
 * @returns The clone of object.
 */
export function clone<T>(obj: T) {
	if (Prtcl.impl('clone', obj)) return obj[Prtcl.cloneThis]()
	return structuredClone(obj)
}
