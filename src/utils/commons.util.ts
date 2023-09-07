export function noop() {}

export type KeysByType<O, T> = {
	[K in keyof O]: O[K] extends T ? K : never
}[keyof O]

export type Values<T extends Record<string, unknown> = Record<string, unknown>> = T[keyof T]
