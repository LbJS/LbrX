import { objectAssign, objectKeys, isClass, isObject, isNullish } from 'lbrx/helpers'

export function instanceHandler<T extends object>(instancedObject: T, plainObject: T): T {
	if (isNullish(plainObject)) return plainObject
	if (isClass(instancedObject) && !isClass(plainObject)) {
		plainObject = instancedObject.constructor.length ?
			objectAssign(new instancedObject.constructor(plainObject), plainObject) :
			objectAssign(new instancedObject.constructor(), plainObject)
	}
	for (let i = 0, keys = objectKeys(instancedObject); i < keys.length; i++) {
		const key = keys[i]
		const instancedObjectProp = instancedObject[key]
		if (isObject(instancedObjectProp)) {
			plainObject[key] = instanceHandler(instancedObjectProp, plainObject[key])
		}
	}
	return plainObject
}
