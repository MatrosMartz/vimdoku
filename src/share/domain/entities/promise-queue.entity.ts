export type PromiseFn = () => Promise<void>
export type ErrorHandler = (err: any) => void | Promise<void>

export class PromiseFnQueue {
	#errorHandler
	#length = 0
	#prev: Promise<void> | null = null

	constructor(errorHandler: ErrorHandler = PromiseFnQueue.IDLE_ERROR_HANDLER) {
		this.#errorHandler = errorHandler
	}

	get lenght() {
		return this.#length
	}

	static IDLE_ERROR_HANDLER: ErrorHandler = err => {
		throw err
	}

	add(fn: PromiseFn) {
		const promise = async () => {
			await fn()
			this.#length--
			this.#prev = null
		}

		this.#length++
		this.#prev = this.#prev != null ? this.#prev.then(promise) : promise()
		this.#prev.catch(this.#errorHandler)

		return this
	}
}
