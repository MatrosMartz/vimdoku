export type VariablesFromStr<
	S extends string,
	InitialKeys = never,
> = S extends `${string}{|${infer VarKey}|}${infer Next}` ? VariablesFromStr<Next, InitialKeys | VarKey> : InitialKeys

export type Difference<T, U> = Exclude<T, U> | Exclude<U, T>
