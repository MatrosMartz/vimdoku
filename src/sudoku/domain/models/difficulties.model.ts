import { keysBy } from '~/share/utils'

export enum DifficultyKind {
	Beginner = '1.92',
	Basic = '1.87',
	Easy = '1.75',
	Medium = '1.5',
	Advanced = '1.4',
	Hard = '1.3',
	Expert = '1.2',
}

export const DIFFICULTIES_NAMES = keysBy(DifficultyKind)
