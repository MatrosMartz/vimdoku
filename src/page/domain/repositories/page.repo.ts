import type { Page } from '$page/domain/entities'

type Unsubscribe = () => Promise<void>

export interface PageRepo {
	get(): Promise<Page.Page>
	go(delta: 'back' | 'forward'): Promise<Page.Page>
	save(page: Page.Page): Promise<void>
	subscribe(sub: (page: Page.Page) => void | Promise<void>): Unsubscribe
}
