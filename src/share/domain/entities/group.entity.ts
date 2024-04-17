import type { Difference } from '~/share/types'

export class Group<const T> {
	readonly at
	readonly contains
	readonly findIndex
	readonly join
	readonly #arr

	constructor(arr: readonly T[]) {
		this.#arr = [...arr]
		this.at = Array.prototype.at.bind(this.#arr)
		this.contains = Array.prototype.includes.bind(this.#arr) as (val: unknown) => val is T
		this.findIndex = Array.prototype.findIndex.bind(this.#arr)
		this.join = Array.prototype.join.bind(this.#arr)
	}

	get length() {
		return this.#arr.length
	}

	static fromKeys<Obj extends Record<string | number | symbol, unknown> | Map<unknown, unknown>>(
		obj: Obj
	): Obj extends Map<infer T, unknown> | Record<infer T, unknown> ? Group<T> : never {
		if (obj instanceof Map) return new Group(Array.from(obj.keys())) as never
		if (typeof obj === 'object') return new Group(Object.keys(obj)) as never

		throw new Error(`obj value invalid: ${String(obj)}`)
	}

	static fromValues<T>(obj: Record<string | number | symbol, T> | Map<unknown, T>) {
		if (obj instanceof Map) return new Group(Array.from(obj.values()))
		if (typeof obj === 'object') return new Group(Object.values(obj))

		throw new Error(`obj value invalid: ${String(obj)}`)
	}

	difference<U>(other: Group<U> | U[] | Set<U>) {
		type F = Difference<T, U>
		if (other instanceof Group) {
			const newArr: F[] = []

			for (const item of this.#arr) if (!other.contains(item)) newArr.push(item as never)
			for (const item of other.#arr) if (!this.contains(item)) newArr.push(item as never)

			return new Group(newArr)
		}
		if (other instanceof Set) {
			const newArr: F[] = []

			for (const item of this.#arr) if (!other.has(item as never)) newArr.push(item as never)
			for (const item of other) if (!this.contains(item)) newArr.push(item as never)

			return new Group(newArr)
		}
		if (Array.isArray(other)) {
			const newArr: F[] = []

			for (const item of this.#arr) if (!other.includes(item as never)) newArr.push(item as never)
			for (const item of other) if (!this.contains(item)) newArr.push(item as never)

			return new Group(newArr)
		}

		throw new Error(`other value invalid: ${String(other)}`)
	}

	groupBy<Groups extends Record<string | number | symbol, T>>(fn: (item: T) => keyof Groups) {
		const obj: { [K in keyof Groups]: Group<Groups[K]> } = {} as never

		for (const item of this.#arr) {
			const group = fn(item)
			if (group in obj) obj[group].#arr.push(item as never)
			else obj[group] = new Group([])
		}

		return obj
	}

	indexOf(val: T) {
		return this.#arr.indexOf(val)
	}

	map<U>(fn: (item: T) => U) {
		return new Group(this.#arr.map(fn))
	}

	random() {
		return this.#arr[Math.floor(Math.random() * this.#arr.length)]
	}

	unwrap() {
		return Array.from(this.#arr)
	}
}
