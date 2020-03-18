import { isDate } from './is-date'
import { isArray } from './is-array'
import { objectAssign } from '../short-hand-functions/object-assign'
import { isObject } from './is-object'
import { isClass } from './is-class'
import { objectKeys } from '../short-hand-functions/object-keys'

export function cloneObject<T extends {}>(obj: T): T {
	if (isDate(obj)) return new Date(obj) as any as T
	let copy: T | [] | null = null
	if (isArray(obj)) {
		copy = objectAssign([], obj)
		// tslint:disable-next-line: prefer-for-of
		for (let i = 0; i < copy.length; i++) {
			if (isObject(copy[i])) copy[i] = cloneObject(copy[i])
		}
	} else if (isObject(obj)) {
		copy = objectAssign<T>(isClass(obj) ? new (obj as any).constructor() : {}, obj as {})
		for (let i = 0, keys = objectKeys(copy); i < keys.length; i++) {
			if (isObject(copy[keys[i]])) copy[keys[i]] = cloneObject(copy[keys[i]])
		}
	}
	return (copy ?? obj) as T
}
