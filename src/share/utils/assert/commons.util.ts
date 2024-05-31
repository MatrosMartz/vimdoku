import type { StrToType, StrTypes } from '~/share/types'

import { Assert, type FnData, type Not } from './core.util'

export const equalTo = <const Options extends unknown[]>(...options: Options) =>
	new Assert<FnData<Options[number]>>(val => options.some(option => val === option))

export const typeOf = <const Types extends StrTypes[]>(...types: Types) =>
	new Assert<FnData<StrToType<Types[number]>>>(val => {
		if (typeof val === 'object') {
			if (types.includes('null') && val === null) return true
			if (types.includes('object') && val !== null) return true
			return false
		}
		return types.includes(typeof val)
	})

export const fromGuard = <Guard>(fn: (val: unknown) => val is Guard) => new Assert<FnData<Guard>>(fn)

export const not = <Data extends FnData>(assert: Assert<Data>) => new Assert<Not<Data>>(val => !assert.fn(val))
