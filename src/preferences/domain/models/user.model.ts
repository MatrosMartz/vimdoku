import type { FieldsEntries, FieldsToModel, FormGroup } from '~/share/domain/models'

export enum Langs {
	EN = 'en',
	ES = 'es',
}

export enum DevicePref {
	DEVICE = 'deviceValue',
	MORE = 'more',
	LESS = 'less',
}

export const userFields = {
	motionReduce: { type: 'options', opts: Object.values(DevicePref) },
	language: { type: 'options', opts: Object.values(Langs) },
	colorTheme: { type: 'text' },
	timer: { type: 'toggle' },
} as const satisfies FormGroup

export type UserPrefs = FieldsToModel<typeof userFields>

export type UserEntries = FieldsEntries<typeof userFields>
