import { objectAssign, objectKeys, isDate, cloneObject, isClass, isObject } from 'lbrx/helpers'

export function instanceHandler<T = {}>(instancedObject: T, plainObject: T): T {
	if (isDate(instancedObject)) return new Date(plainObject as any) as any as T
	let copy = cloneObject(plainObject)
	if (isClass(instancedObject)) {
		copy = objectAssign<T, T>(new (instancedObject as any).constructor(), plainObject)
	}
	for (let i = 0, keys = objectKeys(plainObject); i < keys.length; i++) {
		if (isObject(plainObject[keys[i]])) {
			copy[keys[i]] = instanceHandler(instancedObject[keys[i]], plainObject[keys[i]])
		}
	}
	return copy
}
