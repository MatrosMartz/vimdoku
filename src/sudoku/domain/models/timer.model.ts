export interface ITimer {
	readonly data: number
	dec(): this
	inc(): this
	reset(): this
	toString(): string
}
