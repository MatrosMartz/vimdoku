export const Guard = {
	isPropKey(value: unknown): value is PropertyKey {
		const type = typeof value
		return type === 'string' || type === 'number' || type === 'symbol'
	},
	isSetLike(value: unknown): value is Map<unknown, unknown> | Set<unknown> {
		return value instanceof Map || value instanceof Set
	},
}
