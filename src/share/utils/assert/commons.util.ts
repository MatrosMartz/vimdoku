import type { StrToType, StrTypes } from '~/share/types'

import { inArray } from '../commons.util'
import { Assert, type FnData, type Not } from './core.util'

export const equalTo = <const Options extends unknown[]>(...options: Options) =>
	new Assert<FnData<Options[number]>>(val => options.some(option => val === option))

export const typeOf = <const Type extends StrTypes>(...types: Type[]) =>
	new Assert<FnData<StrToType<Type>>>(val => {
		if (typeof val === 'object') {
			if (inArray(types, 'null') && val === null) return true
			if (inArray(types, 'object') && val !== null) return true
			return false
		}
		return inArray(types, typeof val)
	})

export const fromGuard = <Guard>(fn: (val: unknown) => val is Guard) => new Assert<FnData<Guard>>(fn)

export const not = <Data extends FnData>(assert: Assert<Data>) => new Assert<Not<Data>>(val => !assert.fn(val))
