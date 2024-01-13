import { type Readable, readable } from 'svelte/store'

import type { Observable } from '~/share/domain/entities'

interface CustomReadable<T> extends Readable<T> {
	readonly data: T
}

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
