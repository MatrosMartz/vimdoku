import type { Entry, EntryGetKeyByValue, EntryGetValueByKey, ObjToEntries, ReadonlyRecord } from '~/share/types'
import { A, createArray, entriesToObj } from '~/share/utils'

class HashEntries<E extends Entry = Entry> extends Array<E> {
	static readonly HashKey = Symbol('hash-key')

	readonly #hasFn
	#key: Record<PropertyKey, number> = {}
	#val: Record<PropertyKey, number> = {}

	constructor(entries: readonly E[], hashFn: (some: unknown) => PropertyKey) {
		super(...entries)
		this.#hasFn = hashFn
		for (let index = 0; index < this.length; index++) {
			const [key, val] = entries[index]
			this.#validateEntry(key, val)
			this.#key[this.#hasFn(key)] = this.#val[this.#hasFn(val)] = index
		}
	}

	static hasFn(some: unknown) {
		if (typeof some === 'symbol') return some
		if (typeof some === 'string') return `str-${some}`
		if (typeof some === 'bigint') return `int-${some}`
		if (typeof some === 'number') return `num-${some}`
		if (some == null || typeof some === 'boolean') return String(some)
		if (typeof some === 'object') {
			if (HashEntries.HashKey in some) return some[HashEntries.HashKey] as string
			if (Object.isExtensible(some)) {
				const uuid = globalThis.crypto.randomUUID()
				Object.defineProperty(some, HashEntries.HashKey, { value: uuid })
				return uuid
			}
		}
		throw new Error(`"${String(some)}" is invalid as an argument in hasFn`)
	}

	containsKey(key: unknown) {
		return Object.hasOwn(this.#key, this.#hasFn(key))
	}

	containsValue(value: unknown) {
		return Object.hasOwn(this.#val, this.#hasFn(value))
	}

	indexOfKey(key: unknown) {
		return this.#key[this.#hasFn(key)] ?? -1
	}

	indexOfValue(value: unknown) {
		return this.#val[this.#hasFn(value)] ?? -1
	}

	push([key, val]: E) {
		this.#validateEntry(key, val)
		this.#key[this.#hasFn(key)] = this.#val[this.#hasFn(val)] = this.length
		return super.push([key, val] as never)
	}

	#validateEntry(key: unknown, val: unknown) {
		if (Object.hasOwn(this.#key, this.#hasFn(key)) || Object.hasOwn(this.#val, this.#hasFn(val)))
			throw new Error(`that key or value already exists: [key:${String(key)}, value:${String(val)}]`)
	}
}

abstract class Base<const T extends Entry> {
	[Symbol.iterator] = this.entries
	protected readonly _hashEntries
	abstract readonly size: number

	constructor(hasEntries: HashEntries<T>) {
		this._hashEntries = hasEntries
	}

	abstract containsKey(key: unknown): key is T[0]
	abstract containsValue(value: unknown): value is T[1]
	abstract entries(): IterableIterator<T>
	abstract entryByIndex(index: number): T | null
	abstract findIndex(fn: (entry: T, index: number) => boolean): number
	abstract indexByKey(key: T[0]): number
	abstract indexByValue(value: T[1]): number
	abstract joinKeys(separator?: string): string
	abstract joinValues(separator?: string): string
	abstract keyByValue<Value extends T[1]>(value: Value): EntryGetKeyByValue<T, Value>
	abstract keys(): IterableIterator<T[0]>
	abstract randomIndex(): number
	abstract randomKey(): T[0]
	abstract randomValue(): T[1]
	abstract transform<U>(fn: (entry: T, index: number) => U): U[]
	abstract valueByKey<Key extends T[0]>(key: Key): EntryGetValueByKey<T, Key>
	abstract values(): IterableIterator<T[1]>
}

export class Sub<const T extends Entry> extends Base<T> {
	readonly #indexArr

	constructor(hashEntries: HashEntries<T>, indexArr: readonly number[]) {
		super(hashEntries)
		this.#indexArr = indexArr
	}

	get size() {
		return this.#indexArr.length
	}

	containsKey(key: unknown): key is T[0] {
		return this.#indexArr.includes(this._hashEntries.indexOfKey(key))
	}

	containsValue(value: unknown): value is T[1] {
		return this.#indexArr.includes(this._hashEntries.indexOfValue(value))
	}

	*entries(): IterableIterator<T> {
		for (const i of this.#indexArr) yield this._hashEntries[i]
	}

	entryByIndex(index: number) {
		if (!this.#indexArr.includes(index)) return null
		return this._hashEntries[index] ?? null
	}

	findIndex(fn: (entry: T, index: number) => boolean): number {
		for (const i of this.#indexArr) if (fn(this._hashEntries[i], i)) return i
		return -1
	}

	indexByKey(key: T[0]): number {
		const index = this._hashEntries.indexOfKey(key)
		if (this.#indexArr.includes(index)) return index
		return -1
	}

	indexByValue(value: T[1]): number {
		const index = this._hashEntries.indexOfValue(value)
		if (this.#indexArr.includes(index)) return index
		return -1
	}

	joinKeys(separator: string = ','): string {
		let text = ''
		for (const i of this.#indexArr) {
			if (text.length === 0) text = String(this._hashEntries[i][0])
			else text += separator = String(this._hashEntries[i][0])
		}

		return text
	}

	joinValues(separator: string = ','): string {
		let text = ''
		for (const i of this.#indexArr) {
			if (text.length === 0) text = String(this._hashEntries[i][1])
			else text += separator = String(this._hashEntries[i][1])
		}

		return text
	}

	keyByValue<Value extends T[1]>(value: Value): EntryGetKeyByValue<T, Value> {
		return this._hashEntries[this.indexByValue(value)] as EntryGetKeyByValue<T, Value>
	}

	*keys(): IterableIterator<T[0]> {
		for (const i of this.#indexArr) yield this._hashEntries[i][0]
	}

	randomIndex(): number {
		return this.#indexArr[Math.floor(Math.random() * this.#indexArr.length)]
	}

	randomKey(): T[0] {
		return this._hashEntries[this.randomIndex()][0]
	}

	randomValue(): T[1] {
		return this._hashEntries[this.randomIndex()][1]
	}

	transform<U>(fn: (entry: T, index: number) => U): U[] {
		return this._hashEntries.reduce<U[]>((acc, curr, i) => {
			if (!this.#indexArr.includes(i)) return acc
			return [...acc, fn(curr, i)]
		}, [])
	}

	valueByKey<Key extends T[0]>(key: Key): EntryGetValueByKey<T, Key> {
		return this._hashEntries[this.indexByKey(key)] as EntryGetValueByKey<T, Key>
	}

	*values(): IterableIterator<T[1]> {
		for (const i of this.#indexArr) yield this._hashEntries[i][1]
	}
}

export class Main<const T extends Entry, Subs extends ReadonlyRecord<string, Sub<Entry>>> extends Base<T> {
	readonly subs

	constructor(hashEntries: HashEntries<T>, Subs: Subs) {
		super(hashEntries)
		this.subs = Subs
	}

	get size() {
		return this._hashEntries.length
	}

	containsKey(key: unknown): key is T[0] {
		return this._hashEntries.containsKey(key)
	}

	containsValue(value: unknown): value is T[1] {
		return this._hashEntries.containsValue(value)
	}

	*entries(): IterableIterator<T> {
		for (const entry of this._hashEntries) yield entry
	}

	entryByIndex(index: number): T | null {
		return this._hashEntries[index] ?? null
	}

	findIndex(fn: (entry: T, index: number) => boolean): number {
		return this._hashEntries.findIndex(fn)
	}

	indexByKey(key: T[0]): number {
		return this._hashEntries.indexOfKey(key)
	}

	indexByValue(value: T[1]): number {
		return this._hashEntries.indexOfValue(value)
	}

	joinKeys(separator: string = ','): string {
		return this._hashEntries.reduce((acc, curr) => {
			if (acc.length === 0) return String(curr[0])
			return acc + separator + String(curr[0])
		}, '')
	}

	joinValues(separator: string = ','): string {
		return this._hashEntries.reduce((acc, curr) => {
			if (acc.length === 0) return String(curr[1])
			return acc + separator + String(curr[1])
		}, '')
	}

	keyByValue<Value extends T[1]>(value: Value): EntryGetKeyByValue<T, Value> {
		return this._hashEntries[this._hashEntries.indexOfValue(value)][0] as EntryGetKeyByValue<T, Value>
	}

	*keys(): IterableIterator<T[0]> {
		for (const [key] of this._hashEntries) yield key
	}

	randomIndex(): number {
		return Math.floor(Math.random() * this._hashEntries.length)
	}

	randomKey(): T[0] {
		return this._hashEntries[this.randomIndex()][0]
	}

	randomValue(): T[1] {
		return this._hashEntries[this.randomIndex()][1]
	}

	transform<U>(fn: (entry: T, index: number) => U): U[] {
		return createArray(this._hashEntries.length, i => fn(this._hashEntries[i], i))
	}

	valueByKey<Key extends T[0]>(key: Key): EntryGetValueByKey<T, Key> {
		return this._hashEntries[this._hashEntries.indexOfKey(key)][1] as EntryGetValueByKey<T, Key>
	}

	*values(): IterableIterator<T[1]> {
		for (const [, value] of this._hashEntries) yield value
	}
}

export const entriesByObj: <Obj extends ReadonlyRecord<PropertyKey, unknown>>(obj: Obj) => ObjToEntries<Obj> =
	Object.entries

export class Builder<T extends ReadonlyRecord<string, Entry> = NonNullable<unknown>, AllEntries extends Entry = never> {
	readonly addNewSub = {
		create: this.#createSubCollection.bind(this),
		conditional: this.#createConditionalSubCollections.bind(this),
		fromEntries: this.#addSubCollection.bind(this),
		fromObject: <N extends string, O extends ReadonlyRecord<PropertyKey, unknown>>(name: N, obj: O) =>
			this.#addSubCollection(name, entriesByObj(obj)),
	}
	readonly addToMain = {
		fromEntries: this.#addEntries.bind(this),
		fromObject: <O extends ReadonlyRecord<PropertyKey, unknown>>(obj: O) => this.#addEntries(entriesByObj(obj)),
	}

	#entries: AllEntries[] = []
	#subs: Array<readonly [keyof T, readonly number[]]> = []

	done() {
		const hashEntries = new HashEntries(this.#entries, HashEntries.hasFn)
		const SUBS_ENTRIES = this.#subs.map(([key, indexArr]) => [key, new Sub(hashEntries, indexArr)] as const)
		const SUBS: { readonly [K in keyof T]: Sub<T[K]> } = entriesToObj(SUBS_ENTRIES)

		return new Main(hashEntries, SUBS)
	}

	#addEntries<E extends Entry>(entries: readonly E[]): Builder<T, AllEntries | E> {
		this.#entries = [...this.#entries, ...(entries as never[])]
		return this
	}

	#addSubCollection<N extends string, E extends Entry>(
		name: N,
		entries: readonly E[]
	): Builder<T & ReadonlyRecord<N, E>, AllEntries | E> {
		this.#subs = [...this.#subs, [name, createArray(entries.length, i => this.#entries.length + i)]]
		this.#entries = [...this.#entries, ...(entries as never[])]
		return this as never
	}

	#createConditionalSubCollections<TN extends string, FN extends string, C extends A.FnData>(
		trueName: TN,
		falseName: FN,
		{ fn }: A.Assert<C>
	): Builder<
		T & ReadonlyRecord<TN, A.Get<AllEntries, C>> & ReadonlyRecord<FN, A.Get<AllEntries, A.Not<C>>>,
		AllEntries
	> {
		const [trueIndexes, falseIndexes]: number[][] = [[], []]

		for (let i = 0; i < this.#entries.length; i++)
			if (fn(this.#entries[i])) trueIndexes.push(i)
			else falseIndexes.push(i)

		this.#subs = [...this.#subs, [trueName, trueIndexes], [falseName, falseIndexes]]

		return this as never
	}

	#createSubCollection<N extends string, C extends A.FnData>(
		name: N,
		{ fn }: A.Assert<C>
	): Builder<T & ReadonlyRecord<N, A.Get<AllEntries, C>>, AllEntries> {
		const indexArr = this.#entries.reduce<number[]>((acc, curr, i) => (fn(curr) ? [...acc, i] : acc), [])
		this.#subs = [...this.#subs, [name, indexArr]]

		return this as never
	}
}
