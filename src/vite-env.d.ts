/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ObjectConstructor {
	entries<T>(o: { [K in keyof T]: T[K] }): Array<[K, T[K]]>
}
