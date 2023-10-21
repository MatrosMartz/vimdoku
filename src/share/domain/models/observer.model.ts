export type Observer<T> = (value: T) => void

export type RemoveObserver = () => void

export interface IObservable<T> {
	add(observer: Observer<T>): void
	remove(observer: Observer<T>): void
	update(value: T): void
}

export type SubscriberData<O> = O extends Observer<infer T> ? T : never
