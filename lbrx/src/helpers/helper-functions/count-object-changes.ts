import { isNull } from "./is-null"
import { isArray } from "./is-array"
import { isDate } from "./is-date"
import { isObject } from "./is-object"
import { objectKeys } from "../short-hand-functions/object-keys"
import { isFunction } from "./is-function"
import { isUndefined } from "./is-undefined"

export function countObjectChanges(objA: {} | any[], objB: {} | any[]): number {
	if (isNull(objA) || isNull(objB)) return objA === objB ? 0 : 1
	if (isDate(objA) || isDate(objB)) return isDate(objA) && isDate(objB) && objA.getTime() == objB.getTime() ? 0 : 1
	let changesCount = 0
	const valueComparisonHelper = (x: any, y: any): void => {
		if (isObject(x)) {
			if (isObject(y)) {
				changesCount += countObjectChanges(x, y)
			} else {
				changesCount++
			}
		} else if (isFunction(x) || isFunction(y)) {
			if (isFunction(x) != isFunction(y)) changesCount++
		} else if (x !== y) {
			changesCount++
		}
	}
	if (isArray(objA)) {
		if (isArray(objB)) {
			objA.forEach((x, i) => {
				valueComparisonHelper(x, objB[i])
			})
			if (objB.length > objA.length) changesCount += objB.length - objA.length
		} else {
			changesCount++
		}
	} else {
		objectKeys(objA).forEach(key => {
			valueComparisonHelper(objA[key], objB[key])
		})
		objectKeys(objB).forEach(key => {
			if (isUndefined(objA[key])) changesCount++
		})
	}
	return changesCount
}
