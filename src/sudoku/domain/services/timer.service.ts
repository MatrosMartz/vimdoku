import type { ITimer } from '../models'

export class TimerService implements ITimer {
	#data

	constructor(data: number) {
		this.#data = data
	}

	get data() {
		return this.#data
	}

	static fromString(timerLike: string) {
		const [hours, minutes, seconds] = timerLike.split(':').map(Number)

		if (Number.isNaN(hours)) throw new Error('invalid hours')
		if (Number.isNaN(minutes)) throw new Error('invalid minutes')
		if (Number.isNaN(seconds)) throw new Error('invalid seconds')

		return new TimerService(hours * 3600 + minutes * 60 + seconds)
	}

	static parseString(data: number) {
		const seconds = TimerService.#parseUnit(data % 60)
		const minutes = TimerService.#parseUnit(Math.floor((data % 3600) / 60))
		const hours = TimerService.#parseUnit(Math.floor(data / 3600), 3)

		return `${hours}:${minutes}:${seconds}`
	}

	static #parseUnit(unit: number, digits = 2) {
		if (unit < 10 * (digits - 1)) return '0'.repeat(digits - 1) + unit

		return String(unit)
	}

	dec(): this {
		this.#data--
		return this
	}

	inc(): this {
		this.#data++
		return this
	}

	reset(): this {
		this.#data = 0
		return this
	}

	toString(): string {
		return TimerService.parseString(this.#data)
	}
}
