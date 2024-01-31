import type { FieldsToModel, FormGroup } from '~/share/domain/models'
import { FormFields } from '~/share/domain/services'

export enum Lang {
	EN = 'en',
	ES = 'es',
}

export const LANGS = Object.values(Lang)

export enum Accessibility {
	SYSTEM = 'systemValue',
	MORE = 'more',
	LESS = 'less',
}

export const ACCESSIBILITY_KINDS = Object.values(Accessibility)

export enum ColorSchema {
	SYSTEM = 'systemValue',
	DARK_MODE = 'darkMode',
	LIGHT_MODE = 'lightMode',
}

export const COLOR_SCHEMAS = Object.values(ColorSchema)

export enum IconTheme {
	Heroicons = 'heroicons',
	Lucide = 'lucide',
	Iconoir = 'iconoir',
	Feather = 'feather',
}

export const ICON_THEMES = Object.values(IconTheme)

export const userFields = {
	colorSchema: { type: 'options', opts: COLOR_SCHEMAS, default: ColorSchema.SYSTEM },
	colorTheme: { type: 'text', default: 'default' },
	contrast: { type: 'options', opts: ACCESSIBILITY_KINDS, default: Accessibility.SYSTEM },
	iconTheme: { type: 'options', opts: ICON_THEMES, default: IconTheme.Heroicons },
	language: { type: 'options', opts: LANGS, default: Lang.EN },
	motionReduce: { type: 'options', opts: ACCESSIBILITY_KINDS, default: Accessibility.SYSTEM },
} as const satisfies FormGroup

export type UserPrefs = FieldsToModel<typeof userFields>

export type AccessibilityFields = {
	[K in keyof UserPrefs]: UserPrefs[K] extends Accessibility ? K : never
}[keyof UserPrefs]

export const ACCESSIBILITY_FIELDS: AccessibilityFields[] = ['contrast', 'motionReduce']

export const USER_IDLE_PREFS = FormFields.getDefaultValues(userFields)
