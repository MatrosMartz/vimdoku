import type { FieldsEntries, FieldsToModel, FormGroup } from '~/share/domain/models'

export const sudokuFields = {
	autoNoteDeletion: { type: 'toggle' },
	autoValidation: { type: 'toggle' },
	markRelatedNumbers: { type: 'toggle' },
	remainingNumbers: { type: 'toggle' },
} as const satisfies FormGroup

export type SudokuPrefs = FieldsToModel<typeof sudokuFields>

export type SudokuEntries = FieldsEntries<typeof sudokuFields>
