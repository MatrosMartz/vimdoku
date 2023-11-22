import { readable } from 'svelte/store'

import type { IContext, IObservable } from '~/share/domain/models'

export function createState<T>(observable: IObservable<T>, ctx: IContext<T>) {
	return readable(ctx.data, observer => {
		observable.add(observer)
		return () => observable.remove(observer)
	})
}
