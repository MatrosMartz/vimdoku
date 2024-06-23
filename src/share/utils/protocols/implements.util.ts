import { cloneThis, equalsTo, relatedProps, unwraper } from './symbols.util'

export interface IEquals<T> {
	[equalsTo](other: T): boolean
}

export interface IRelated<RelatedProps extends readonly PropertyKey[]> {
	[relatedProps]: RelatedProps
}

export interface IClone<T> {
	[cloneThis](): T
}

export interface IUnwrap<T> {
	[unwraper](): T
}

interface Protocols<T> {
	clone: IClone<unknown>
	equals: IEquals<unknown>
	related: IRelated<readonly [keyof T, ...(keyof T)[]]>
	unwrap: IUnwrap<unknown>
}

/**
 * Checks if object implements some protocol.
 * @param protocol The name of protocol.
 * @param obj The object.
 * @returns True if implements the protocol, false otherwise.
 */
export function impl<T, Prtcl extends keyof Protocols<T>>(protocol: Prtcl, obj: T): obj is T & Protocols<T>[Prtcl] {
	if (obj == null || (typeof obj !== 'object' && typeof obj !== 'function')) return false
	if (protocol === 'equals') return equalsTo in obj
	if (protocol === 'related') return relatedProps in obj
	if (protocol === 'clone') return cloneThis in obj
	if (protocol === 'unwrap') return unwraper in obj
	return false
}
