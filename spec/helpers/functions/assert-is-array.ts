import { AssertionError } from './assertion-error'

export function assertIsArray(input: any): asserts input is Array<any> {
  if (!Array.isArray(input)) throw new AssertionError(`${input} is not Array.`)
}
