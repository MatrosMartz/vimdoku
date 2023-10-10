export function noop() {}

export type KeysByType<O, T> = {
	[K in keyof O]: O[K] extends T ? K : never
}[keyof O]

export type RequireOne<T> = {
	[K in keyof T]: {
		[O in keyof T]?: T[O]
	} & {
		[P in K]: T[P]
	}
}[keyof T]

export type Entries<T> = Array<
	{
		[K in keyof T]: [K, T[K]]
	}[keyof T]
>

export function xor(a: boolean, b: boolean) {
	return (a || b) && !(a && b)
}

export type Values<T extends Record<string, unknown> = Record<string, unknown>> = T[keyof T]

export function _throw(err: Error): never {
	throw err
}

export function capitalCase(str: string) {
	return (
		str[0].toUpperCase() +
		str
			.slice(1)
			.split(/(?=[A-Z])/)
			.join(' ')
	)
}
