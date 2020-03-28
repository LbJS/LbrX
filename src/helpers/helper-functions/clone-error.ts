import { isArray, isObject, isError, getOwnPropertyNames } from 'lbrx/helpers'
import { cloneObject } from './clone-object'

export function cloneError<T extends Error>(error: T): T {
	if (!isError(error)) return error
	const copy = new (error as any).constructor()
	for (let i = 0, keys = getOwnPropertyNames(error); i < keys.length; i++) {
		const key = keys[i]
		const errProp = error[key]
		if (isError(errProp)) {
			copy[key] = cloneError(errProp)
		} else if (isArray(errProp)) {
			copy[key] = [...errProp]
			for (let j = 0; j < copy[key].length; j++) {
				if (isObject(copy[key][j])) copy[key][j] = cloneObject(copy[key][j])
			}
		} else if (isObject(errProp)) {
			copy[key] = cloneObject(errProp)
		} else {
			copy[key] = errProp
		}
	}
	return copy
}
