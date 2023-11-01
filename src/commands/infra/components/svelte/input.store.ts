import { writable } from 'svelte/store'

export const input = writable<HTMLInputElement | null>(null)
