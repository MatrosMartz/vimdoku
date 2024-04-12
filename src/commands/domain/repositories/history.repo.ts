export interface HistoryRepo {
	clear(): Promise<void>
	get(): Promise<string[] | null>
	has(): Promise<boolean>
	save(data: string[]): Promise<void>
}
