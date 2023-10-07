export interface OptionField<T = string> {
	opts: readonly T[]
	type: 'options'
}

export interface NumberField {
	max?: number
	min?: number
	type: 'number'
}

export interface TextField {
	regex?: RegExp
	type: 'text'
}

export interface ToggleField {
	type: 'toggle'
}

export type Field = NumberField | TextField | ToggleField | OptionField

export type FormGroup = Record<string, Field>
export type FormSchema = Record<string, FormGroup>

export type FieldsToModel<F extends FormGroup> = {
	-readonly [P in keyof F]: F[P] extends NumberField
		? number
		: F[P] extends TextField
		? string
		: F[P] extends ToggleField
		? boolean
		: F[P] extends OptionField<infer Opts>
		? Opts
		: never
}

export type SchemaToModel<S extends FormSchema> = {
	-readonly [P in keyof S]: FieldsToModel<S[P]>
}
