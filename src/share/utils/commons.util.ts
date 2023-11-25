export function noop() {}

export function xor(a: boolean, b: boolean) {
	return (a || b) && !(a && b)
}

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

export function runAsync(fn: () => Promise<void>) {
	void fn()
}

type StrTypes = 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined'

type StrToType<T extends StrTypes> = T extends 'string'
	? string
	: T extends 'number'
	  ? number
	  : T extends 'boolean'
	    ? boolean
	    : T extends 'object'
	      ? object
	      : T extends 'bigint'
	        ? bigint
	        : T extends 'symbol'
	          ? symbol
	          : T extends 'function'
	            ? (...args: any[]) => any
	            : never

export function typeFallback<T extends StrTypes>(type: T, value: unknown, fallback: StrToType<T>): StrToType<T> {
	// eslint-disable-next-line valid-typeof
	return typeof value === type ? (value as StrToType<T>) : fallback
}
