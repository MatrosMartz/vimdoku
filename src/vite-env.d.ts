import 'svelte'
import 'vite/client'

interface ObjectConstructor {
	entries<O>(o: { [K in keyof O]: O[K] }): Array<[K, O[K]]>
	keys<O>(o: O): Array<keyof O>
}

interface Array<T> {
	includes(searchElement: unknown, fromIndex?: number): searchElement is T
}
