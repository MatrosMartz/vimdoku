import { readable } from 'svelte/store'

import type { IObs } from '~/share/domain/models'

export function createState<T>(obs: IObs<T>) {
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
