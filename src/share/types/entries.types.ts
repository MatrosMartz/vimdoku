/** Basic Entry type. */
export type Entry<Key = unknown, Value = unknown> = readonly [Key, Value]

/** Basic Entries type. */
export type Entries<Key = unknown, Value = unknown> = ReadonlyArray<Entry<Key, Value>>

/** Transform entries type in to object type. */
export type EntriesToObj<E extends Entries> = E[number][0] extends PropertyKey
	? {
			readonly [P in E[number][0]]: Extract<E[number], [P, unknown]>[1]
		}
	: never

export type EntriesToArray<E extends Entries> =
	E extends Entries<infer Key, infer Val>
		? Key extends Val
			? Val extends Key
				? readonly Val[]
				: never
			: never
		: never

export type EntriesToSet<E extends Entries> =
	E extends Entries<infer Key, infer Val>
		? Key extends Val
			? Val extends Key
				? ReadonlySet<Val>
				: never
			: never
		: never

export type EntriesToMap<E extends Entries> = E extends Entries<infer Key, infer Val> ? ReadonlyMap<Key, Val> : never

/** Gets the entries for an object. */
export type ObjToEntries<T> = ReadonlyArray<
	{
		[K in keyof T]: readonly [K, T[K]]
	}[keyof T]
>

export type EntryGetValueByKey<T extends Entry, Key> = T extends infer U
	? U extends Entry<Key, infer Val>
		? Val
		: never
	: never

export type EntryGetKeyByValue<T extends Entry, Val> = T extends infer U
	? U extends Entry<infer Key, Val>
		? Key
		: never
	: never

export type EntryExcludeByKeys<T extends Entry, S> = ReadonlyArray<
	T extends infer U ? (U extends Entry<infer Key, unknown> ? (Key extends S ? never : U) : never) : never
>

export type EntryExcludeByValues<T extends Entry, S> = ReadonlyArray<
	T extends infer U ? (U extends Entry<unknown, infer Val> ? (Val extends S ? never : U) : never) : never
>

export type EntryExtractByKeys<T extends Entry, S> = ReadonlyArray<
	T extends infer U ? (U extends Entry<infer Key, unknown> ? (Key extends S ? U : never) : never) : never
>

export type EntryExtractByValues<T extends Entry, S> = ReadonlyArray<
	T extends infer U ? (U extends Entry<unknown, infer Val> ? (Val extends S ? U : never) : never) : never
>

export type EntryFilterByKey<T extends Entry, Key> = Key extends infer U ? [U, EntryGetValueByKey<T, U>] : never

export type EntryFilterByValue<T extends Entry, Val> = Val extends infer U ? [EntryGetKeyByValue<T, U>, U] : never

export type UnionToEntries<T> = T extends infer U ? [U, U] : never
