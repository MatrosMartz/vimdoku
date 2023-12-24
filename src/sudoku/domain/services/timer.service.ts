import { inject } from '~/share/utils'

import type { ITimer } from '../models'
import { TimerObs } from './sudoku-obs.service'

/** Represent a TimerBoard Service. */
export class TimerSvc implements ITimer {
	#data = 0
	#intervalID: ReturnType<typeof setInterval> | null = null
	readonly #obs = inject(TimerObs)

	get data() {
		return this.#data
	}

	/**
	 * Creates an instance of TimerSvc from a string representation of time in the "HH:MM:SS" format.
	 * @param timerLike A string in the "HH:MM:SS" format representing time.
	 * @returns A new TimerSvc instance with the time parsed from the input string.
	 * @throws {Error} If the input string is not a valid time representation.
	 */
	static fromString(timerLike: string) {
		const [hours, minutes, seconds] = timerLike.split(':').map(Number)

		if (Number.isNaN(hours)) throw new Error('invalid hours')
		if (Number.isNaN(minutes)) throw new Error('invalid minutes')
		if (Number.isNaN(seconds)) throw new Error('invalid seconds')

		return new TimerSvc().set(hours * 3600 + minutes * 60 + seconds)
	}

	/**
	 * Converts the current time value to a string representation in the "HH:MM:SS" format.
	 * @param data The time value in seconds to be formatted.
	 * @returns A string representing the time in "HH:MM:SS" format.
	 */
	static parseString(data: number) {
		const seconds = TimerSvc.#parseUnit(data % 60)
		const minutes = TimerSvc.#parseUnit(Math.floor((data % 3600) / 60))
		const hours = TimerSvc.#parseUnit(Math.floor(data / 3600))

		return `${hours}:${minutes}:${seconds}`
	}

	/**
	 * Formats a time unit (hours, minutes, or seconds) to have a minimum number of digits.
	 * @param unit The time unit to be formatted.
	 * @param digits The minimum number of digits for the formatted unit (default is 2).
	 * @returns A string representation of the unit with the specified number of digits.
	 */
	static #parseUnit(unit: number, digits = 2) {
		return String(unit).padStart(digits, '0')
	}

	pause() {
		if (this.#intervalID != null) {
			clearInterval(this.#intervalID)
			this.#intervalID = null
		}

		return this
	}

	reset(): this {
		this.#data = 0
		this.#obs.set(this.toString())
		return this
	}

	set(num: number) {
		this.#data = num
		this.#obs.set(this.toString())
		return this
	}

	start() {
		if (this.#intervalID != null) return this

		this.#intervalID = setInterval(() => this.#inc().#obs.set(this.toString()), 1000)

		return this
	}

	toString() {
		return TimerSvc.parseString(this.#data)
	}

	/** Decrements the current time value by 1 second. */
	#dec() {
		this.#data--
		return this
	}

	/** Increments the current time value by 1 second. */
	#inc(): this {
		this.#data++
		return this
	}
}
