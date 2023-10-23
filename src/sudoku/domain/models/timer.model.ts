export interface ITimer {
	/** Get the current time value in seconds. */
	readonly data: number
	/**
	 * Decrements the current time value by 1 second.
	 * @returns This TimerService instance after decrementing the time value.
	 */
	dec(): this
	/**
	 * Increments the current time value by 1 second.
	 * @returns This TimerService instance after incrementing the time value.
	 */
	inc(): this
	/**
	 * Resets the current time value to 0 seconds.
	 * @returns This TimerService instance after resetting the time value.
	 */
	reset(): this
	/**
	 * Converts the current time value to a string representation in the "HH:MM:SS" format.
	 * @returns A string representing the current time value in "HH:MM:SS" format.
	 */
	toString(): string
}
