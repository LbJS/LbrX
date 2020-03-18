import { Constructable } from 'lbrx/helpers'

export function isClass<T>(value: {}): value is Constructable<T> {
	return value.constructor.name !== 'Object'
}
