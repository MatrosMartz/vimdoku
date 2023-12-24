const create: unique symbol = Symbol('injection')

export type Class<T extends object> = new (...args: any[]) => T

export interface Decorated<T extends object> extends Class<T> {
	[create](): T
}

export type Decorator = <const C extends Class<object>>(Target: C) => C

export const injectable = <const C extends Class<object>>(Target: C): C => {
	return class Injectable extends Target {
		static [create]() {
			return new Injectable()
		}
	}
}

export const singleton: Decorator = Target => {
	return class Singleton extends Target {
		// eslint-disable-next-line @typescript-eslint/prefer-readonly
		static #instance: Singleton

		static [create]() {
			Singleton.#instance ??= new Singleton()

			return Singleton.#instance
		}
	}
}

export function inject<const I extends object>(C: Class<I> | Decorated<I>) {
	return create in C ? C[create]() : new C()
}
