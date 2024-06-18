export const equalsTo = Symbol('Prtcl.equalsTo')

export interface IEquals<T> {
	[equalsTo](other: T): boolean
}

/**
 * Checks if two values are equals.
 * @param a First value.
 * @param b Second value.
 * @returns True if both values are equals, false otherwise.
 */
export function equals(a: unknown, b: unknown) {
	if (impl('equals', a)) return a[equalsTo](b)
	if (impl('equals', b)) return b[equalsTo](a)
	if (Number.isNaN(a) && Number.isNaN(b)) return true
	return a === b
}

export const relatedTo = Symbol('Prtcl.relatedTo')

export interface IRelated<T> {
	[relatedTo](other: T): boolean
}

/**
 * Checks if the two values are related.
 * @param a First value.
 * @param b Second value.
 * @returns True if both are related, false otherwise.
 */
export function related(a: unknown, b: unknown) {
	if (impl('related', a)) return a[relatedTo](b)
	if (impl('related', b)) return b[relatedTo](a)
	return false
}

export const cloneThis = Symbol('Prtcl.cloneThis')

export interface IClone<T> {
	[cloneThis](): T
}

/**
 * Create clone of object.
 * @param obj The object.
 * @returns The clone of object.
 */
export function clone<T>(obj: T) {
	if (impl('clone', obj)) return obj[cloneThis]()
	return structuredClone(obj)
}

interface Protocols<T> {
	clone: T & IClone<T>
	equals: T & IEquals<T>
	related: T & IRelated<T>
}

/**
 * Checks if object implements some protocol.
 * @param protocol The name of protocol.
 * @param obj The object.
 * @returns True if implements the protocol, false otherwise.
 */
export function impl<T, Prtcl extends keyof Protocols<T>>(protocol: Prtcl, obj: T): obj is Protocols<T>[Prtcl] {
	if (obj == null || (typeof obj !== 'object' && typeof obj !== 'function')) return false
	if (protocol === 'equals') return equalsTo in obj
	if (protocol === 'related') return relatedTo in obj
	return false
}
