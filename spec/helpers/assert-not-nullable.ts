import { AssertionError } from './assertion-error'

export function assertNotNullable<T>(input: T): asserts input is NonNullable<T> {
  if (input === undefined || input === null) {
    throw new AssertionError('Value must be not nullable.')
  }
}
