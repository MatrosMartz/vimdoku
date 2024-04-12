export type Class<T extends object> = new (...args: any[]) => T

const injectMap = new Map<Class<object>, { type: 'singleton' | 'injectable'; create(): object }>()

export type Decorator = <const C extends Class<object>>(Target: C) => C

export const injectable: Decorator = Target => {
	injectMap.set(Target, { type: 'injectable', create: () => new Target() })
	return Target
}

export const singleton: Decorator = Target => {
	const instance = new Target()
	injectMap.set(Target, { type: 'singleton', create: () => instance })
	return Target
}

/**
 * Inject a class.
 * @param C The class.
 * @returns The class instance that is injected.
 */
export function inject<const I extends object>(C: Class<I>) {
	if (injectMap.has(C)) return injectMap.get(C)!.create() as I
	return new C()
}

/**
 * Replace injection with mock singleton.
 * @param C Class was mocked.
 * @param create Create the mock instance.
 * @returns The mock singleton.
 */
export function mockSingleton<const I extends object>(C: Class<I>, create: () => I) {
	const instance = create()
	if (injectMap.has(C) && injectMap.get(C)?.type === 'singleton')
		injectMap.set(C, { ...injectMap.get(C)!, create: () => instance })
	return instance
}
