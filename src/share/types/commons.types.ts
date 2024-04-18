export type VariablesFromStr<
	S extends string,
	InitialKeys = never,
> = S extends `${string}{|${infer VarKey}|}${infer Next}` ? VariablesFromStr<Next, InitialKeys | VarKey> : InitialKeys

export type Difference<T, U> = Exclude<T, U> | Exclude<U, T>

export type Class<T extends object> = new (...args: any[]) => T
export type AbstractClass<T extends object> = abstract new (...args: any[]) => T

export type ClassDecorator = <const C extends Class<object>>(Target: C) => C
