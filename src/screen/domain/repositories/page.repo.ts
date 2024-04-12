import type { Page } from '$screen/domain/entities'

type Unsubscribe = () => Promise<void>

export interface PageRepo {
	get(): Promise<Page>
	save(page: Page): Promise<void>
	subscribe(sub: (page: Page) => void | Promise<void>): Unsubscribe
}
