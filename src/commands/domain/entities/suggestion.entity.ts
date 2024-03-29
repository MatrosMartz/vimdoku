import type { NamespaceTextGetter, ShareLocale } from '~/locales'

export type DescFn = (locale: NamespaceTextGetter<ShareLocale>) => string

export type Desc = [DescFn, ...DescFn[]]

export interface SuggOpts<T> {
	desc: Desc
	header: T
	id: string
	value: string
	weight: number
}

export class Sugg<T> {
	readonly #desc
	readonly #header
	readonly #id
	readonly #value
	readonly #weight

	constructor(opts: SuggOpts<T>)
	constructor({ desc, value, weight, header, id }: SuggOpts<T>) {
		this.#desc = desc
		this.#value = value
		this.#weight = weight
		this.#header = header
		this.#id = id
	}

	get desc() {
		return this.#desc
	}

	get header() {
		return this.#header
	}

	get id() {
		return this.#id
	}

	get value() {
		return this.#value
	}

	get weight() {
		return this.#weight
	}

	toJSON() {
		return { weight: this.#weight, header: this.#header, value: this.#value, desc: this.#desc }
	}
}
