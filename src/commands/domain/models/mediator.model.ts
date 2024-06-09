import type { Action, DataAction } from './action.model'

export interface IMed {
	/**
	 * Dispatches an action to the mediator without associated data.
	 * @param action The action to be dispatched.
	 * @param data The data associated with the action.
	 * @returns The updated Executor.
	 */
	dispatch<Data extends DataAction | never>(action: Action<Data>, data?: Data): this
	/**
	 * Asynchronously loads data.
	 * @returns A promise that resolves when loading is complete.
	 */
	load(): Promise<void>
	unload(): Promise<void>
}
