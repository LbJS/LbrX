import { Constructable } from 'lbrx/helpers'

export function isClass(value: object): value is Constructable {
	return value && value.constructor.name !== 'Object'
}
