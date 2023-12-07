import type { FormGroup, FormSchema } from '../models'

export const FormFields = {
	/**
	 * Get new object with only default values.
	 * @param group The form group.
	 * @returns New object with keys of the form group and the default value.
	 */
	getDefaultValues<FG extends FormGroup>(group: FG) {
		return Object.fromEntries(Object.entries(group).map(([key, value]) => [key, value.default])) as {
			[K in keyof FG]: FG[K]['default']
		}
	},
	getGroupEntries<FS extends FormSchema>(schema: FS) {
		return Object.entries(schema).map(([key, value]) => [key, Object.entries(value)] as const)
	},
} as const
