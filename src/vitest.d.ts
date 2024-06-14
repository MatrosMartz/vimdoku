import '@testing-library/jest-dom/vitest'
import 'vitest'

import type CustomMatcher from 'jest-extended'

declare module 'vitest' {
	interface Assertion<T = any> extends CustomMatchers<T> {}
	interface AsymmetricMatchersContaining<T = any> extends CustomMatchers<T> {}
	interface ExpectStatic extends CustomMatchers<T> {}
}
