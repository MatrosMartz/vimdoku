/* eslint-disable @typescript-eslint/triple-slash-reference */
///  <reference types='svelte' />
///  <reference types='vite/client' />

interface ObjectConstructor {
	entries<const O extends Record<string, unknown>>(obj: O): Array<{ [K in keyof O]: [K, O[K]] }[keyof O]>
	keys<O>(o: O): Array<keyof O>
}

interface Array<T> {
	includes(searchElement: unknown, fromIndex?: number): searchElement is T
}
