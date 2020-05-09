import { parse, stringify } from '../short-hand-functions'

export function simpleCloneObject<T extends object>(obj: T): T {
  return parse(stringify(obj))
}
