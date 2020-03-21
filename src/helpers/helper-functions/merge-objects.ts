import { objectKeys, objectAssign, isObject, isNull } from 'lbrx/helpers'
import { isDate } from './is-date'

export function mergeObjects<T extends object>(target: T, source: Partial<T>): T {
	for (let i = 0, keys = objectKeys(target); i < keys.length; i++) {
		if (isObject(target[keys[i]]) &&
			!isDate(target[keys[i]]) &&
			!isNull(source[keys[i]])
		) {
			source[keys[i]] = mergeObjects(target[keys[i]], source[keys[i]])
		}
	}
	return objectAssign(target, source)
}
