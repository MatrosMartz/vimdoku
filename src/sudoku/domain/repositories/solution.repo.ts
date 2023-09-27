import type { Solution } from '../models'

export interface SolutionRepo {
	create(): Promise<void>
	delete(): Promise<void>
	getSolution(): Promise<Solution | null>
	has(): Promise<boolean>
}
