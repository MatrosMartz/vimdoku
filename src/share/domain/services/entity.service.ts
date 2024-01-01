import type { IEntity } from '../models'

export class Entity implements IEntity {
	readonly #id = crypto.randomUUID()

	get id() {
		return this.#id
	}
}
