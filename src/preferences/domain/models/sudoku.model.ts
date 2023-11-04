import type { FieldsEntries, FieldsToModel, FormGroup } from '~/share/domain/models'

export const sudokuFields = {
	automaticNoteDeletion: { type: 'toggle' },
	automaticValidation: { type: 'toggle' },
	highlightNumber: { type: 'toggle' },
	remainingNumbers: { type: 'toggle' },
} as const satisfies FormGroup

export type SudokuPreferences = FieldsToModel<typeof sudokuFields>

export type SudokuEntries = FieldsEntries<typeof sudokuFields>
