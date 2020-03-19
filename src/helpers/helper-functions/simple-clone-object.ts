import { stringify, parse } from 'lbrx/helpers'

export function simpleCloneObject<T extends object>(obj: T): T {
	return parse(stringify(obj))
}
