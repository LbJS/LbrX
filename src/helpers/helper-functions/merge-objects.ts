import { objectKeys, objectAssign, isObject, isNull, isDate } from 'lbrx/helpers'
import { isArray } from './is-array'

export function mergeObjects<T extends object>(target: T, source: Partial<T>): T {
	for (let i = 0, keys = objectKeys(target); i < keys.length; i++) {
		if (isDate(target[keys[i]]) || isDate(source[keys[i]])) {
			target[keys[i]] = source[keys[i]]
		} else if (isObject(target[keys[i]]) &&
			!isArray(target[keys[i]]) &&
			!isArray(source[keys[i]]) &&
			!isNull(source[keys[i]])
		) {
			source[keys[i]] = mergeObjects(target[keys[i]], source[keys[i]])
		}
	}
	return objectAssign(target, source)
}
