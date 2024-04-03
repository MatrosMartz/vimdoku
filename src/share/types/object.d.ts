export type BasicObj = Record<string | number | symbol, unknown>

export type KeysByType<O, T> = {
	[K in keyof O]: O[K] extends T ? K : never
}[keyof O]

/** Basic Entry type. */
export type Entry = [string | number | symbol, unknown]

/** Types valid as key for entry. */
export type EntryKeys = string | number | symbol

/** Basic Entries type. */
export type Entries = Entry[]

/** Transform entries type in to object type. */
export type EntriesToObj<E extends Entries> = { [P in E[number][0]]: Extract<E[number], [P, unknown]>[1] }

export type RequireOne<T> = {
	[K in keyof T]: {
		[O in keyof T]?: T[O]
	} & {
		[P in K]: T[P]
	}
}[keyof T]

/** Gets the entries for an object. */
export type GetEntries<T> = Array<
	{
		[K in keyof T]: [K, T[K]]
	}[keyof T]
>

export type Values<T> = T[keyof T]

export type OptionalKeys<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] } & { [P in K]?: T[P] }

export type InvertKeyValues<T extends Record<string | number | symbol, string | number | symbol>> = {
	[K in keyof T as T[K]]: K
}
