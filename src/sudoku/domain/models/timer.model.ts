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
	 * Start the timer.
	 * @param effect Function to be executed each time the timer value changes.
	 * @returns This TimerSvc instance after start the timer.
	 */
	start(effect: () => void): this
	/**
	 * Converts the current time value to a string representation in the "HH:MM:SS" format.
	 * @returns A string representing the current time value in "HH:MM:SS" format.
	 */
	toString(): string
}
