export interface IEntity {
	readonly id: ReturnType<typeof crypto.randomUUID>
}
