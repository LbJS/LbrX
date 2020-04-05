import { Constructable } from 'lbrx/types'
import { isObject } from './is-object'

export function isClass(value: object): value is Constructable {
	return isObject(value) && value.constructor.name !== 'Object'
}
