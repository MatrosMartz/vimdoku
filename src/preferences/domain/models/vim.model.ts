import type { FieldsToModel, FormGroup } from '~/share/domain/models'
import { FormFields } from '~/share/domain/services'

export const vimFields = {
	cursorBox: { type: 'toggle', default: false },
	cursorCol: { type: 'toggle', default: false },
	cursorRow: { type: 'toggle', default: false },
	history: { max: 200, min: 10, type: 'number', default: 20 },
	numbers: { type: 'toggle', default: true },
	relativeNumbers: { type: 'toggle', default: false },
} as const satisfies FormGroup

export type VimPrefs = FieldsToModel<typeof vimFields>

export const VIM_IDLE_PREFS = FormFields.getDefaultValues(vimFields)
