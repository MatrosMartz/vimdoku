import type { Assert, AssertFn } from './assert.util'
import { noop } from './commons.util'

export type MatchFunc<T extends readonly any[], R> = (...value: T) => R
export type MatchCase<T extends readonly any[], R> = [AssertFn<T>, MatchFunc<T, R>]

type CustomExtract<T, U> =
	Extract<T, U> extends never ? { [K in keyof T]: K extends keyof U ? Extract<T[K], U[K]> : never } : Extract<T, U>

export type MergeArgs<T extends readonly any[], C extends Assert<readonly unknown[]>> =
	C extends Assert<infer U> ? { [K in keyof T]: K extends keyof U ? CustomExtract<T[K], U[K]> : never } : never

type CustomExclude<T, U> = {
	[K in keyof T]: K extends keyof U ? (T[K] extends U[K] ? T[K] : Exclude<T[K], U[K]>) : never
}

export class BuildMatchFn<Args extends readonly any[], Return, PosibleArgs extends Args = Args> {
	#defaultFn: (...args: Args) => Return = noop as never
	readonly #list: Array<MatchCase<Args, Return>> = []

	addCase<const C extends Assert<readonly unknown[]>>(
		casesArr: C,
		fn: MatchFunc<MergeArgs<PosibleArgs, C>, Return>
	): BuildMatchFn<Args, Return, CustomExclude<PosibleArgs, MergeArgs<PosibleArgs, C>>> {
		this.#list.push([casesArr.fn, fn] as never)
		return this as never
	}

	default(fn: (...args: PosibleArgs) => Return): BuildMatchFn<Args, Return, never> {
		this.#defaultFn = fn as never
		return this as never
	}

	done() {
		return (...val: Args) => {
			return this.#list.find(([assert]) => assert(val))?.[1](...val) ?? this.#defaultFn(...val)
		}
	}
}
