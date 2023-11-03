import { getContext, setContext } from 'svelte'
import { type Readable } from 'svelte/store'

const key = Symbol('selected')

export function createSelectedContext(store: Readable<string>) {
	setContext<Readable<string>>(key, store)
}

export function getSelectedContext() {
	return getContext<Readable<string>>(key)
}
