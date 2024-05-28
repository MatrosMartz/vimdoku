import type { ReadonlyRecord } from './object'

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
							? ReadonlyRecord<PropertyKey, unknown>
							: Str extends 'function'
								? (...args: any[]) => any
								: Str extends 'null'
									? null
									: never

export type NoInfer<T> = [T][T extends any ? 0 : never]

export type Intersect<T extends any[]> = T extends [infer X, ...infer Rest] ? X & Intersect<Rest> : unknown

export type Primitives = string | number | bigint | boolean | symbol | undefined | null

export type NoNever<T, U> = [T] extends [never] ? U : T

export type NoNeverArray<T extends readonly any[], U extends readonly any[]> = T[number] extends never ? U : T
