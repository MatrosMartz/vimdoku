import type { FieldsToModel, FormGroup } from '~/share/domain/models'
import { FormFields } from '~/share/domain/services'

export const sudokuFields = {
	autoNoteDeletion: { type: 'toggle', default: true },
	autoSave: { type: 'toggle', default: true },
	autoValidation: { type: 'toggle', default: true },
	markRelatedNumbers: { type: 'toggle', default: true },
	remainingNumbers: { type: 'toggle', default: true },
	timer: { type: 'toggle', default: true },
} as const satisfies FormGroup

export type SudokuPrefs = FieldsToModel<typeof sudokuFields>

export const SUDOKU_IDLE_PREFS = FormFields.getDefaultValues(sudokuFields)
