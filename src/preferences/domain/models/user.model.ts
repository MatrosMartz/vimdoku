import { Collection } from '~/share/domain/entities'
import type { FieldsToModel, FormGroup } from '~/share/domain/models'
import { FormFields } from '~/share/domain/services'

export enum Accessibility {
	SYSTEM = 'system',
	MORE = 'more',
	LESS = 'less',
}

export const ACCESSIBILITIES = new Collection.Builder().addEntries(Collection.entriesByObj(Accessibility)).done()

export enum ColorSchema {
	SYSTEM = 'system',
	DARK_MODE = 'dark',
	LIGHT_MODE = 'light',
}

export const COLOR_SCHEMAS = new Collection.Builder().addEntries(Collection.entriesByObj(ColorSchema)).done()

export enum IconTheme {
	Heroicons = 'Heroicons',
	Lucide = 'Lucide',
	Iconoir = 'Iconoir',
	Tabler = 'Tabler',
}

export const ICON_THEMES = new Collection.Builder().addEntries(Collection.entriesByObj(IconTheme)).done()

export const userFields = {
	colorSchema: { type: 'options', opts: COLOR_SCHEMAS, default: ColorSchema.SYSTEM },
	colorTheme: { type: 'text', default: 'default' },
	contrast: { type: 'options', opts: ACCESSIBILITIES, default: Accessibility.SYSTEM },
	iconTheme: { type: 'options', opts: ICON_THEMES, default: IconTheme.Heroicons },
	motionReduce: { type: 'options', opts: ACCESSIBILITIES, default: Accessibility.SYSTEM },
} as const satisfies FormGroup

export type UserPrefs = FieldsToModel<typeof userFields>

export type AccessibilityFields = {
	[K in keyof UserPrefs]: UserPrefs[K] extends Accessibility ? K : never
}[keyof UserPrefs]

export const ACCESSIBILITY_PREFS_NAMES: AccessibilityFields[] = ['contrast', 'motionReduce']

export const USER_IDLE_PREFS = FormFields.getDefaultValues(userFields)
