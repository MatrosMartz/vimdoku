import type { FieldsToModel, FormGroup } from '~/share/domain/models'

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
	colorSchema: { type: 'options', opts: Object.values(Schema), default: Schema.SYSTEM },
	colorTheme: { type: 'text', default: 'default' },
	contrast: { type: 'options', opts: Object.values(Accessibility), default: Accessibility.SYSTEM },
	iconTheme: { type: 'text', default: 'default' },
	language: { type: 'options', opts: Object.values(Langs), default: Langs.EN },
	motionReduce: { type: 'options', opts: Object.values(Accessibility), default: Accessibility.SYSTEM },
} as const satisfies FormGroup

export type UserPrefs = FieldsToModel<typeof userFields>
