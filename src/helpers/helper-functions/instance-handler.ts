import { objectAssign, objectKeys, cloneObject, isClass, isObject } from 'lbrx/helpers'

export function instanceHandler<T extends object>(instancedObject: T, plainObject: T): T {
	let copy = cloneObject(plainObject)
	if (isClass(instancedObject)) {
		copy = instancedObject.constructor.length ?
			new instancedObject.constructor(plainObject) :
			objectAssign(new instancedObject.constructor(), plainObject)
	}
	for (let i = 0, keys = objectKeys(plainObject); i < keys.length; i++) {
		const key = keys[i]
		if (isObject(plainObject[key])) copy[key] = instanceHandler(instancedObject[key], plainObject[key])
	}
	return copy
}
