import type { IObservable, Observer } from '../models'

export class Observable<T> implements IObservable<T> {
	#subs = new Set<Observer<T>>()

	add(sub: Observer<T>) {
		this.#subs.add(sub)
	}

	remove(sub: Observer<T>) {
		this.#subs.delete(sub)
	}

	update(data: T) {
		for (const sub of this.#subs) sub(data)
	}
}
