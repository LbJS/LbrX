import { AssertionError } from './assertion-error'

export function assert(input: any): asserts input {
	if (!input) throw new AssertionError("Input value can't be falsy")
}
