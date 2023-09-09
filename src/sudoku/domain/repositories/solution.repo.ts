import type { Solution } from '../entities'

export interface SolutionRepo {
	create(): Promise<void>
	delete(): Promise<void>
	getSolution(): Promise<Solution | null>
	has(): Promise<boolean>
}
