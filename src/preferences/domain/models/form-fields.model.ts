export interface OptionField<T> {
	opts: T[]
	type: 'options'
}

export interface NumberField {
	max?: number
	min?: number
	type: 'number'
}

export interface StringField {
	regex?: RegExp
	type: 'string'
}

export interface ToggleField {
	type: 'toggle'
}

export type FormField = Record<string, NumberField | StringField | ToggleField | OptionField<unknown>>

export type FieldsToModel<F extends FormField> = {
	[P in keyof F]: F[P] extends NumberField
		? number
		: F[P] extends StringField
		? string
		: F[P] extends ToggleField
		? boolean
		: F[P] extends OptionField<infer T>
		? T
		: never
}
