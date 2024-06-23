import * as Prtcl from './protocols'

/**
 * Gets data from object.
 * @param obj The object.
 * @returns If object implements unwrap protocol returns data, returns the object otherwise.
 */
export function unwrap<U>(obj: Prtcl.IUnwrap<U>): U
// eslint-disable-next-line jsdoc/require-jsdoc
export function unwrap<T>(obj: T): T
// eslint-disable-next-line jsdoc/require-jsdoc
export function unwrap(obj: unknown) {
	if (Prtcl.impl('unwrap', obj)) return obj[Prtcl.unwraper]()
	return obj
}
