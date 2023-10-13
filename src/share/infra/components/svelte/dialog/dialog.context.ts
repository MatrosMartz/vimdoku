import { getContext, setContext } from 'svelte'
import type { Subscriber, Unsubscriber } from 'svelte/motion'
import { writable } from 'svelte/store'

export interface DialogState {
	close(): void
	open(): void
	subscribe(run: Subscriber<boolean>): Unsubscriber
}

export function createDialogStore(value: boolean): DialogState {
	const { subscribe, set } = writable(value)

	return { close: () => set(false), open: () => set(true), subscribe }
}

const key = Symbol('dialog')

export function createDialogContext(store: DialogState) {
	setContext(key, store)
}

export function getDialogContext() {
	return getContext<DialogState>(key)
}
