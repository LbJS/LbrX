import { stringify, parse } from 'lbrx/helpers'

export function simpleObjectClone<T extends object>(obj: T): T {
	return parse(stringify(obj))
}
