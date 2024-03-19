import type { PageWithLang } from '../entities'

export interface PageRepo {
	get(): Promise<PageWithLang>
	set(fullRoute: PageWithLang): Promise<void>
	update(fn: (fullRoute: PageWithLang) => PageWithLang): Promise<void>
}
