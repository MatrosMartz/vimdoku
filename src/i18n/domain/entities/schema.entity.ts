export type SchemaKeys<T> = T extends object
	? {
			[K in keyof T]-?: K extends string
				? T[K] extends string | string[]
					? `${K}`
					: `${K & string}-${SchemaKeys<T[K]>}`
				: never
		}[keyof T]
	: never

export type SchemaValue<T extends string, O> = T extends `${infer P}-${infer S}`
	? P extends keyof O
		? { [K in P]: SchemaValue<S, O[K]> }[P]
		: never
	: T extends keyof O
		? { [K in T]: O[K] }[T]
		: never
