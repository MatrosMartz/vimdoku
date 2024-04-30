export type VariablesFromStr<
	S extends string,
	InitialKeys = never,
> = S extends `${string}{|${infer VarKey}|}${infer Next}` ? VariablesFromStr<Next, InitialKeys | VarKey> : InitialKeys

export type Difference<T, U> = Exclude<T, U> | Exclude<U, T>

export type Class<T extends object> = new (...args: any[]) => T
export type AbstractClass<T extends object> = abstract new (...args: any[]) => T

export type ClassDecorator = <const C extends Class<object>>(Target: C) => C

export type StrTypes =
	| 'string'
	| 'number'
	| 'bigint'
	| 'boolean'
	| 'symbol'
	| 'undefined'
	| 'object'
	| 'function'
	| 'null'

export type StrToType<Str extends StrTypes> = Str extends 'string'
	? string
	: Str extends 'number'
		? number
		: Str extends 'bigint'
			? bigint
			: Str extends 'boolean'
				? boolean
				: Str extends 'symbol'
					? symbol
					: Str extends 'undefined'
						? undefined
						: Str extends 'object'
							? object
							: Str extends 'function'
								? (...args: any[]) => any
								: Str extends 'null'
									? null
									: never

export type NoInfer<T> = [T][T extends any ? 0 : never]
