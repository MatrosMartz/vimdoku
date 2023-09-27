import type { FieldsToModel, FormField } from './form-fields.model'

export const sudokuFields = {
	automaticNoteDeletion: { type: 'toggle' },
	automaticValidation: { type: 'toggle' },
	highlightNumber: { type: 'toggle' },
	remainingNumbers: { type: 'toggle' },
} as const satisfies FormField

export interface SudokuPreferences extends FieldsToModel<typeof sudokuFields> {}
