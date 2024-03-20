import type { Lang } from '../const'

export interface I18nRepo {
	get(): Promise<Lang | null>
}
