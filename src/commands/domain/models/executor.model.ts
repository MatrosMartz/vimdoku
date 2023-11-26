export interface IExec {
	/**
	 * Executes a command-like input.
	 * @param cmdLike The command-like input to execute.
	 * @returns The updated Executor.
	 */
	run(cmdLike: string): this
	/**
	 * Searches for autocomplete suggestions based on the provided command-like input.
	 * @param cmdLike The command-like input to search for suggestions.
	 * @returns The updated Executor.
	 */
	searchAutocomplete(cmdLike: string): this
}
