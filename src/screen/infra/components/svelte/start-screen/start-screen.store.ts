import { writable } from 'svelte/store'

export const startType = writable<'start' | 'select'>('start')
