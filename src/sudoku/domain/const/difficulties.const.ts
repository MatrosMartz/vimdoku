import { Group } from '~/share/domain/entities'
import { invertKeyValues } from '~/share/utils'

export enum DifficultyKind {
	beginner = '1.92',
	basic = '1.87',
	easy = '1.75',
	medium = '1.5',
	advanced = '1.4',
	hard = '1.3',
	expert = '1.2',
}

export const DIFFICULTIES_NAMES = Group.fromKeys(DifficultyKind)

export const GET_DIFFICULTY_NAME = invertKeyValues(DifficultyKind)
