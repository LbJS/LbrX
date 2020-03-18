import { Constructable } from 'lbrx/helpers'

export function isClass(value: {}): value is Constructable {
	return value.constructor.name !== 'Object'
}
