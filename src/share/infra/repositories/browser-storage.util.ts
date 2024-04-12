import { option } from '~/share/utils'

/** Create localStorage abstraction. */
export class BrowserStorage<T> {
	readonly #name
	readonly #parser
	readonly #unParser
	constructor(name: string, parser: (raw: string) => T, unParser: (val: T) => string) {
		this.#name = name
		this.#parser = parser
		this.#unParser = unParser
	}

	static basic<T>(name: string) {
		return new BrowserStorage<T>(name, JSON.parse, JSON.stringify)
	}

	del() {
		localStorage.removeItem(this.#name)
	}

	get(): T | null {
		return option(localStorage.getItem(this.#name), this.#parser)!
	}

	set(value: T) {
		localStorage.setItem(this.#name, this.#unParser(value))
	}
}
