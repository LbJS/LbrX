import { newError } from '../shortened-functions'
import { isNumber } from './is-number'

export function isCalledBy(name: string, index?: number): boolean {
  let stack = newError().stack
  if (!stack) return false
  const stackSegments = stack.split(`\n`).splice(4).map(x => x.trim())
  const somePredicate = (value: string): boolean => {
    stack = value.split(` (`)[0]
    return !!stack && stack.endsWith(name)
  }
  if (isNumber(index)) return !!stackSegments[index] && somePredicate(stackSegments[index])
  return stackSegments.some(somePredicate)
}
