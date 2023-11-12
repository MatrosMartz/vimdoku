import { writable } from 'svelte/store'

export const startType = writable<'hub' | 'select'>('hub')
