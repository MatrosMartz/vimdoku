import type { Page } from '../entities'

export interface PageRepo {
	get(): Promise<Page>
	set(page: Page): Promise<void>
	subscribe(sub: (page: Page) => void): () => void
	update(fn: (fullRoute: Page) => Page): Promise<void>
}
