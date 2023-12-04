import type { FieldsEntries, FieldsToModel, FormGroup } from '~/share/domain/models'

export enum Langs {
	EN = 'en',
	ES = 'es',
}

export enum Accessibility {
	SYSTEM = 'systemValue',
	MORE = 'more',
	LESS = 'less',
}

export enum Schema {
	SYSTEM = 'systemValue',
	DARK_MODE = 'darkMode',
	LIGHT_MODE = 'lightMode',
}

export const userFields = {
	motionReduce: { type: 'options', opts: Object.values(Accessibility) },
	colorSchema: { type: 'options', opts: Object.values(Schema) },
	language: { type: 'options', opts: Object.values(Langs) },
	colorTheme: { type: 'text' },
	timer: { type: 'toggle' },
} as const satisfies FormGroup

export type UserPrefs = FieldsToModel<typeof userFields>

export type UserEntries = FieldsEntries<typeof userFields>
