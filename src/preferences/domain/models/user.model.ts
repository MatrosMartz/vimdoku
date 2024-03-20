import type { FieldsToModel, FormGroup } from '~/share/domain/models'
import { FormFields } from '~/share/domain/services'

export enum Accessibility {
	SYSTEM = 'system',
	MORE = 'more',
	LESS = 'less',
}

export const ACCESSIBILITY_KINDS = Object.values(Accessibility)

export enum ColorSchema {
	SYSTEM = 'system',
	DARK_MODE = 'dark',
	LIGHT_MODE = 'light',
}

export const COLOR_SCHEMAS = Object.values(ColorSchema)

export enum IconTheme {
	Heroicons = 'heroicons',
	Lucide = 'lucide',
	Iconoir = 'iconoir',
	Tabler = 'tabler',
}

export const ICON_THEMES = Object.values(IconTheme)

export const userFields = {
	colorSchema: { type: 'options', opts: COLOR_SCHEMAS, default: ColorSchema.SYSTEM },
	colorTheme: { type: 'text', default: 'default' },
	contrast: { type: 'options', opts: ACCESSIBILITY_KINDS, default: Accessibility.SYSTEM },
	iconTheme: { type: 'options', opts: ICON_THEMES, default: IconTheme.Heroicons },
	motionReduce: { type: 'options', opts: ACCESSIBILITY_KINDS, default: Accessibility.SYSTEM },
} as const satisfies FormGroup

export type UserPrefs = FieldsToModel<typeof userFields>

export type AccessibilityFields = {
	[K in keyof UserPrefs]: UserPrefs[K] extends Accessibility ? K : never
}[keyof UserPrefs]

export const ACCESSIBILITY_FIELDS: AccessibilityFields[] = ['contrast', 'motionReduce']

export const USER_IDLE_PREFS = FormFields.getDefaultValues(userFields)
