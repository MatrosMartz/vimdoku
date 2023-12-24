export interface ITimer {
	/** Get the current time value in seconds. */
	readonly data: number

	/**
	 * Pause the increase or decrease of time.
	 * @returns This TimerSvc instance after freezing the time value.
	 */
	pause(): this
	/**
	 * Resets the current time value to 0 seconds.
	 * @returns This TimerSvc instance after resetting the time value.
	 */
	reset(): this
	/**
	 * Set the current time.
	 * @param num The new value of the current time value.
	 * @returns This TimerSvc instance after resetting the time value.
	 */
	set(num: number): this
	/**
	 * Start the timer.
	 * @returns This TimerSvc instance after start the timer.
	 */
	start(): this
	/**
	 * Converts the current time value to a string representation in the "HH:MM:SS" format.
	 * @returns A string representing the current time value in "HH:MM:SS" format.
	 */
	toString(): string
}

export const IDLE_TIMER = '--:--:--'
