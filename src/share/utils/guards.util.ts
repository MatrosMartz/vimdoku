import type { Numeric } from '../types'

/**
 * Checks if some property exist in value.
 * @param value The value.
 * @param prop The property
 * @returns True if value is object and inclues the property, false otherwise.
 */
function In<T>(value: T, prop: PropertyKey): prop is keyof T {
	return isObject(value) && prop in value
}

/**
 * Checks if some value is array.
 * @param value The value.
 * @returns True if is array, false otherwise.
 */
export function isArray(value: unknown): value is readonly unknown[] {
	return Array.isArray(value)
}

/**
 * Checks if some value is number or bigint.
 * @param value The value.
 * @returns True if value is number or bigint, false otherwise.
 */
export function isNumeric(value: unknown): value is Numeric {
	const type = typeof value
	return type === 'number' || type === 'bigint'
}

/**
 * Checks if some value is object.
 * @param value The value.
 * @returns True if value is object, false otherwise.
 */
export function isObject(value: unknown): value is object {
	const type = typeof value
	return type === 'function' || (type != null && type === 'object')
}

/**
 * Checks if some value is number, string or symbol.
 * @param value The value.
 * @returns True if value is number, string or symbol, false otherwise.
 */
export function isPropKey(value: unknown): value is PropertyKey {
	const type = typeof value
	return type === 'string' || type === 'number' || type === 'symbol'
}

/**
 * Checks if some value is set or map.
 * @param value The value.
 * @returns True if value is set or map, false otherwise.
 */
export function isSetLike(value: unknown): value is Map<unknown, unknown> | Set<unknown> {
	return value instanceof Map || value instanceof Set
}

export { In as in }
