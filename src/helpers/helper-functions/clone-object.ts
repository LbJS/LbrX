import { isArray, objectAssign, isObject, isClass, objectKeys } from 'lbrx/helpers'

export function cloneObject<T extends object>(obj: T): T {
	let copy: T | any[] | null = null
	if (isArray(obj)) {
		copy = [...obj]
		for (let i = 0; i < copy.length; i++) {
			if (isObject(copy[i])) copy[i] = cloneObject(copy[i])
		}
	} else if (isObject(obj)) {
		if (isClass(obj)) {
			copy = obj.constructor.length ?
				new obj.constructor(obj) as T :
				objectAssign(new obj.constructor() as T, obj)
		} else {
			copy = { ...obj }
		}
		for (let i = 0, keys = objectKeys(copy); i < keys.length; i++) {
			const key = keys[i]
			if (isObject(copy[key])) copy[key] = cloneObject(copy[key])
		}
	}
	return (copy ?? obj) as T
}
