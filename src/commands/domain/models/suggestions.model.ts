export interface Suggestion {
	desc: string
	header: HTMLHeadingElement
	id: string
	input: string
}

export interface ISuggestion {
	/** Get the current Suggestion data. */
	readonly data: Suggestion
	/**
	 * Check if the given command matches the suggestion based on the regular expression.
	 * @param cmd The command to be matched.
	 * @returns True if the command matches the suggestion, otherwise false.
	 */
	match(cmd: string): boolean
}

export const COMMANDS_NAMES = ['help', 'set', 'start', 'pause', 'continue', 'write', 'quit', 'exit', 'xit', 'wquit']
