export interface Sugg {
	descriptions: [string, ...string[]]
	header: HTMLHeadingElement
	id: string
	input: string
}

export interface ISugg {
	/** Get the current Suggestion data. */
	readonly data: Sugg
	/**
	 * Check if the given command matches the suggestion based on the regular expression.
	 * @param cmd The command to be matched.
	 * @returns True if the command matches the suggestion, otherwise false.
	 */
	match(cmd: string): boolean
}

export const COMMANDS_NAMES = ['help', 'set', 'start', 'pause', 'resume', 'write', 'quit', 'exit', 'xit', 'wquit']
