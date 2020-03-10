import { isNull } from "./is-null"
import { isArray } from "./is-array"
import { isDate } from "./is-date"
import { isObject } from "./is-object"
import { objectKeys } from "../short-hand-functions/object-keys"
import { isFunction } from "./is-function"
import { isUndefined } from "./is-undefined"

export function countObjectChanges(objA: {} | any[], objB: {} | any[]): number {
	if (isNull(objA) || isNull(objB)) return objA === objB ? 0 : 1
	let changesCount = 0
	if (isArray(objA)) {
		if (isArray(objB)) {
			objA.forEach((x, i) => {
				const y = objB[i]
				if (isDate(x)) {
					if (!isDate(y) || x.getTime() != y.getTime()) changesCount++
				} else if (isObject(x)) {
					if (isObject(y)) {
						changesCount += countObjectChanges(x, y)
					} else {
						changesCount++
					}
				} else {
					if (x !== y) changesCount++
				}
			})
			if (objB.length > objA.length) changesCount += objB.length - objA.length + 1
		} else {
			changesCount++
		}
	} else {
		objectKeys(objA).forEach(key => {
			const x = objA[key]
			const y = objB[key]
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
		})
		objectKeys(objB).forEach(key => {
			if (isUndefined(objA[key])) changesCount++
		})
	}
	return changesCount
}
