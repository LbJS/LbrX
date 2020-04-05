import { AssertionError } from './assertion-error'

export function assertEqual<T>(input: T, expected: T): asserts input is T {
	if (!Object.is(input, expected)) throw new AssertionError(`${input} doesn't equal ${expected}`)
}
