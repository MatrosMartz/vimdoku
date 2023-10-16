export interface BrowserStorage {
	del(): void
	get(): string | null
	set(value: string): void
}

export function createBrowserStorage(name: string): BrowserStorage {
	return {
		del: () => localStorage.removeItem(name),
		get: () => localStorage.getItem(name),
		set: value => localStorage.setItem(name, value),
	}
}
