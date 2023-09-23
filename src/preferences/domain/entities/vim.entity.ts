import type { FieldsToModel, FormField } from './form-fields.entity'

export const vimFields = {
	fontSize: { type: 'number' },
	history: { min: 0, max: 500, type: 'number' },
	numbers: { type: 'toggle' },
	relativeNumbers: { type: 'toggle' },
} as const satisfies FormField

export interface VimPreferences extends FieldsToModel<typeof vimFields> {}
