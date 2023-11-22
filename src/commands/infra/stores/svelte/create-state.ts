import { readable } from 'svelte/store'

import type { IContext, IObservable } from '~/share/domain/models'

export function createState<T>(observable: IObservable<T>, ctx: IContext<T>) {
	const { subscribe } = readable(ctx.data, observer => {
		observable.add(observer)
		observer(ctx.data)
		return () => observable.remove(observer)
	})

	return {
		subscribe,
		get data() {
			return ctx.data
		},
	}
}
