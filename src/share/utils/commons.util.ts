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
