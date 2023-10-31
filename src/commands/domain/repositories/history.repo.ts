export interface HistoryRepo {
	get(): Promise<string[]>
	has(): Promise<boolean>
	save(data: string[]): Promise<void>
}
