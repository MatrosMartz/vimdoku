import type { PageWithLang } from '../entities'

export interface RouteRepo {
	get(): PageWithLang
	set(fullRoute: PageWithLang): void
	update(fn: (fullRoute: PageWithLang) => PageWithLang): void
}
