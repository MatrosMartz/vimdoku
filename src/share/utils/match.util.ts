import type * as A from './assert'
import { noop } from './commons.util'

export type ArgsType = readonly any[]

export type Case<R> = readonly [A.Predicate, (...args: ArgsType) => R]

export type GetPosibleArgs<C extends A.FnData, U extends ArgsType> =
	U extends A.Get<U, C> ? U : Extract<A.Get<U, A.Not<C>>, U>

export class Builder<Args extends ArgsType, Return, PosibleArgs extends Args = Args> {
	#default: (...args: ArgsType) => Return = noop
	readonly #list: Case<Return>[] = []

	addCase<const C extends A.FnData>(
		assert: A.Assert<C>,
		fn: (...args: A.Get<PosibleArgs, C>) => Return
	): Builder<Args, Return, GetPosibleArgs<C, PosibleArgs>> {
		this.#list.push([assert.fn, fn])

		return this as never
	}

	default(fn: (...args: PosibleArgs) => Return): Builder<Args, Return, never> {
		this.#default = fn

		return this as never
	}

	done() {
		return (...args: Args): Return => {
			const fn = this.#list.find(([assert]) => assert(args))?.[1] ?? this.#default
			return fn(...args)
		}
	}
}
