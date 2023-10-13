import { getContext, setContext } from 'svelte'
import { type Subscriber, type Unsubscriber, writable } from 'svelte/store'

interface SelectedStore {
	set(value: string): void
	subscribe(run: Subscriber<string>): Unsubscriber
}

const key = Symbol('selected')

export function createSelectedContext(value: string, setExternal: (value: string) => void) {
	const { subscribe, set: setStore } = writable(value)

	setContext<SelectedStore>(key, {
		subscribe,
		set(newValue) {
			setStore(newValue)
			setExternal(newValue)
		},
	})
}

export function getSelectedContext() {
	return getContext<SelectedStore>(key)
}
