export type Observer<T> = (value: T) => void

export type RemoveObserver = () => void

export interface IObservable<T> {
	add(observer: Observer<T>): void
	remove(observer: Observer<T>): void
	update(value: T): void
}

export interface IContext<T> {
	readonly data: T
	push(data: T): void
}

export interface IAsyncContext<T> extends IContext<T> {
	load(cb: () => Promise<T>): Promise<void>
}

export interface IHistoryContext<T> extends IAsyncContext<T> {
	readonly history: T[]
	redo(): void
	undo(): void
}

export type Store<State extends Record<string, IContext<unknown>>> = {
	[key in keyof State]: State[key]
}
