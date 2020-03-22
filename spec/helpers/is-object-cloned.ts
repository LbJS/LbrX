import { compareObjects, isObject } from 'lbrx/helpers'

export function isObjectCloned(objA: {} | [], objB: {} | []): boolean {
	if (!compareObjects(objA, objB)) return false
	if (!isObject(objA) || !isObject(objB)) return false
	if (objA === objB || objA.constructor.name != objB.constructor.name) return false
	for (const key in objA) {
		if (isObject(objA[key]) && !isObjectCloned(objA[key], objB[key])) return false
	}
	return true
}
