export interface BrowserStorage {
	del(): void
	get(): string | null
	set(value: string): void
}
