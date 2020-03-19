import { objectAssign, objectKeys, cloneObject, isClass, isObject, isNullish } from 'lbrx/helpers'

export function instanceHandler<T extends object>(instancedObject: T, plainObject: T): T {
	let copy = cloneObject(plainObject)
	if (isClass(instancedObject) && !isClass(copy)) {
		copy = instancedObject.constructor.length ?
			new instancedObject.constructor(plainObject) :
			objectAssign(new instancedObject.constructor(), plainObject)
	}
	for (let i = 0, keys = objectKeys(plainObject); i < keys.length; i++) {
		const key = keys[i]
		const instancedObj = instancedObject[key]
		const plainObj = plainObject[key]
		if (isObject(plainObj)) {
			copy[key] = instanceHandler(instancedObj, plainObj)
		} else if (!isNullish(plainObj) &&
			isClass(instancedObj) &&
			instancedObj.constructor.length
		) {
			copy[key] = new instancedObj.constructor(plainObj)
		}
	}
	return copy
}
