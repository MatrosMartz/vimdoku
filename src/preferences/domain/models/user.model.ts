import type { FieldsToModel, FormField } from './form-fields.model'

export enum Langs {
	EN = 'en',
	ES = 'es',
}

export const userField = {
	animations: { type: 'toggle' },
	language: { type: 'options', opts: Object.values(Langs) },
	theme: { type: 'string' },
	timer: { type: 'toggle' },
} as const satisfies FormField

export interface UserPreferences extends FieldsToModel<typeof userField> {}
