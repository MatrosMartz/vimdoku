import { type Readable, readable } from 'svelte/store'

import type { Observable } from '~/share/domain/entities'

interface CustomReadable<T> extends Readable<T> {
	readonly data: T
}

/**
 * Create custom svelte store.
 * @param obs The observable.
 * @returns A custom store.
 */
export function createState<T>(obs: Observable<T>): CustomReadable<T> {
	const { subscribe } = readable(obs.data, observer => {
		obs.add(observer)
		return () => obs.remove(observer)
	})

	return {
		subscribe,
		get data() {
			return obs.data
		},
	}
}

/**
 * Create a custom svelte store, derived of the observable.
 * @param obs The observable.
 * @param fn The derived function.
 * @returns A custom store
 */
export function createDerived<T, U>(obs: Observable<U>, fn: (value: U) => T): CustomReadable<T> {
	const { subscribe } = readable(fn(obs.data), observer => {
		const wrapper = (value: U) => observer(fn(value))
		obs.add(wrapper)
		return () => obs.remove(wrapper)
	})

	return {
		subscribe,
		get data() {
			return fn(obs.data)
		},
	}
}
