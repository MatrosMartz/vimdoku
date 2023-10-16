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

export type Entries<T> = Array<
	{
		[K in keyof T]: [K, T[K]]
	}[keyof T]
>

export type Values<T> = T[keyof T]