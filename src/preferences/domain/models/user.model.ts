import type { FieldsToModel, FormGroup } from '~/share/domain/models'

export enum Langs {
	EN = 'en',
	ES = 'es',
}

export const userFields = {
	animations: { type: 'toggle' },
	language: { type: 'options', opts: Object.values(Langs) },
	theme: { type: 'text' },
	timer: { type: 'toggle' },
} as const satisfies FormGroup

export type UserPreferences = FieldsToModel<typeof userFields>
