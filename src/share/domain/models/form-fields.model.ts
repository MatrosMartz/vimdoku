import type { Collection } from '../entities'

export interface OptionField<T extends string = string> {
	default: T
	opts: Collection.Main<readonly [string, T], NonNullable<unknown>>
	type: 'options'
}

export interface NumberField {
	max?: number
	min?: number
	default: number
	type: 'number'
}

export interface TextField {
	regex?: RegExp
	default: string
	type: 'text'
}

export interface ToggleField {
	default: boolean
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

export type FieldsEntries<F extends FormGroup> = Array<
	{
		[K in keyof F]: [
			K,
			F[K] extends NumberField
				? number
				: F[K] extends TextField
					? string
					: F[K] extends ToggleField
						? boolean
						: F[K] extends OptionField<infer Opts>
							? Opts
							: never,
		]
	}[keyof F]
>

export type SchemaEntries = Array<[string, [string, Field]]>
