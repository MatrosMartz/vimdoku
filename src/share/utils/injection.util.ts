import type { Class, ClassDecorator } from '../types'

const injectMap = new Map<Class<object>, { type: 'singleton' | 'injectable'; create(): object }>()

export const injectable: ClassDecorator = Target => {
	injectMap.set(Target, { type: 'injectable', create: () => new Target() })
	return Target
}

export const singleton: ClassDecorator = Target => {
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
