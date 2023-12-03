import type { FieldsEntries, FieldsToModel, FormGroup } from '~/share/domain/models'

export const vimFields = {
	history: { max: 500, min: 50, type: 'number' },
	numbers: { type: 'toggle' },
	relativeNumbers: { type: 'toggle' },
} as const satisfies FormGroup

export type VimPrefs = FieldsToModel<typeof vimFields>

export type VimEntries = FieldsEntries<typeof vimFields>
