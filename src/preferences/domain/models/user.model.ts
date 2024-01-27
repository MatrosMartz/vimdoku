import type { FieldsToModel, FormGroup } from '~/share/domain/models'
import { FormFields } from '~/share/domain/services'

export enum Lang {
	EN = 'en',
	ES = 'es',
}

export enum Accessibility {
	SYSTEM = 'systemValue',
	MORE = 'more',
	LESS = 'less',
}

export enum ColorSchema {
	SYSTEM = 'systemValue',
	DARK_MODE = 'darkMode',
	LIGHT_MODE = 'lightMode',
}

export enum IconTheme {
	Heroicons = 'heroicons',
	Lucide = 'lucide',
	Iconoir = 'iconoir',
	Feather = 'feather',
}

export const userFields = {
	colorSchema: { type: 'options', opts: Object.values(ColorSchema), default: ColorSchema.SYSTEM },
	colorTheme: { type: 'text', default: 'default' },
	contrast: { type: 'options', opts: Object.values(Accessibility), default: Accessibility.SYSTEM },
	iconTheme: { type: 'options', opts: Object.values(IconTheme), default: IconTheme.Heroicons },
	language: { type: 'options', opts: Object.values(Lang), default: Lang.EN },
	motionReduce: { type: 'options', opts: Object.values(Accessibility), default: Accessibility.SYSTEM },
} as const satisfies FormGroup

export type UserPrefs = FieldsToModel<typeof userFields>

export type AccessibilityFields = {
	[K in keyof UserPrefs]: UserPrefs[K] extends Accessibility ? K : never
}[keyof UserPrefs]

export const ACCESSIBILITY_FIELDS: AccessibilityFields[] = ['contrast', 'motionReduce']

export const USER_IDLE_PREFS = FormFields.getDefaultValues(userFields)
