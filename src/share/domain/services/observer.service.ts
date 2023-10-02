import type { IObservable, Observer, RemoveObserver } from '../models'

export const notifyObservers = Symbol('notify-observers')

export abstract class ObservableService<T> implements IObservable<T> {
	#observers = new Set<Observer<T>>()
	#timer: number | null = null

	addObserver(observer: Observer<T>): RemoveObserver {
		this.#observers.add(observer)

		return () => this.#observers.delete(observer)
	}

	protected [notifyObservers](value: T) {
		if (this.#timer != null) clearTimeout(this.#timer)

		this.#timer = setTimeout(() => {
			for (const observer of this.#observers) observer.update(value)
		}, 500) as unknown as number
	}
}
