export function noop() {}

export type KeysByType<O, T> = {
	[K in keyof O]: O[K] extends T ? K : never
}[keyof O]

export function xor(a: boolean, b: boolean) {
	return (a || b) && !(a && b)
}

export type Values<T extends Record<string, unknown> = Record<string, unknown>> = T[keyof T]

export function _throw(err: Error): never {
	throw err
}
