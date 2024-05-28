export type BasicObj = Record<string | number | symbol, unknown>

export type KeysByType<O, T> = {
	[K in keyof O]: O[K] extends T ? K : never
}[keyof O]

export type RequireOne<T> = {
	[K in keyof T]: {
		[O in keyof T]?: T[O]
	} & {
		[P in K]: T[P]
	}
}[keyof T]

export type Values<T> = T[keyof T]

export type OptionalKeys<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] } & { [P in K]?: T[P] }

export type InvertKeyValues<T extends Record<string | number | symbol, string | number | symbol>> = {
	[K in keyof T as T[K]]: K
}

export type ReadonlyRecord<K extends PropertyKey, V> = {
	readonly [U in K]: V
}

export type SetLike = ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
