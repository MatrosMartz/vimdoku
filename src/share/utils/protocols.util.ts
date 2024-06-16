export const equalsTo = Symbol('equals-to')

export interface IEquals<T> {
	[equalsTo](other: T): boolean
}

/**
 * Check if object implements equalsTo protocol.
 * @param obj The object.
 * @returns True if object implements the protocol, false otherwise.
 */
export function implementsEquals<T extends object>(obj: T): obj is IEquals<T> & T {
	return equalsTo in obj
}
