export class Entity {
	readonly #id = crypto.randomUUID()

	get id() {
		return this.#id
	}
}
