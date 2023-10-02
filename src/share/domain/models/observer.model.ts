export type Update<T> = (value: T) => void

export interface Observer<T> {
	update: Update<T>
}

export type RemoveObserver = () => void

export interface IObservable<T> {
	addObserver(observer: Observer<T>): RemoveObserver
}
