import { entriesBy, inArray, keysBy } from '~/share/utils'

import type { Field, FormGroup } from '../models'

export const FormFields = {
	/**
	 * Get new object with only default values.
	 * @param group The form group.
	 * @returns New object with keys of the form group and the default value.
	 */
	getDefaultValues<FG extends FormGroup>(group: FG) {
		return Object.fromEntries(entriesBy(group).map(([key, value]) => [key, value.default])) as {
			[K in keyof FG]: FG[K]['default']
		}
	},
	satisfiesField(field: Field, value: unknown) {
		if (field.type === 'number') return typeof value === 'number' && FormFields.numberInRange(value, field)
		if (field.type === 'options') return inArray(field.opts, value)
		if (field.type === 'text') return typeof value === 'string' && (field.regex?.test(value) ?? true)
		if (field.type === 'toggle') return typeof value === 'boolean'
		throw new Error(`Not valid Field: "${JSON.stringify(field)}"`)
	},
	numberInRange(value: number, range: { max?: number; min?: number }) {
		if (range.max != null && value > range.max) return false
		if (range.min != null && value < range.min) return false
		return true
	},
	satisfiesGroup(group: FormGroup, value: Record<string, unknown>) {
		for (const key of keysBy(group)) if (!FormFields.satisfiesField(group[key], value[key])) return false
		return true
	},
} as const
