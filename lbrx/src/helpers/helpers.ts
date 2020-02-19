export function deepFreeze<T extends {}>(object: T): Readonly<T> {
	for (const name of Object.getOwnPropertyNames(object)) {
		const value = object[name];
		if (value && typeof value == 'object') {
			object[name] = deepFreeze(value)
		}
	}
	return Object.freeze(object);
}

export function isPromise(obj: unknown): obj is Promise<unknown> {
	return obj instanceof Promise
}

// tslint:disable-next-line: ban-types
export function isFunction(value: unknown): value is Function {
	return typeof value == 'function'
}

export function isString(value: any): value is string {
	return typeof value == 'string'
}

export function isBool(value: any): value is boolean {
	return typeof value == 'boolean'
}

export function isNull(value: any): value is null {
	return value === null
}

export function isObject(value: any): value is {} {
	return typeof value == 'object'
}

export interface Constructable<T = {}> {
	// tslint:disable-next-line: callable-types
	new(...args: any[]): T;
}

export function isClass<T = {}>(value: {}): value is Constructable<T> {
	return value.constructor.name !== 'Object'
}

export function countObjChanges(oldObj: {}, newObj: {}): number {
	let changesCount = 0
	if (Array.isArray(oldObj)) {
		if (!Array.isArray(newObj) ||
			Array.isArray(newObj) &&
			JSON.stringify(oldObj) != JSON.stringify(newObj)
		) {
			changesCount++
		}
	} else {
		Object.keys(newObj).forEach(key => {
			if (typeof oldObj[key] == 'object' &&
				typeof newObj[key] == 'object'
			) {
				changesCount += countObjChanges(oldObj[key], newObj[key])
			}
			if (oldObj[key] !== newObj[key]) changesCount++
		})
	}
	return changesCount
}

export function objectCompare(obj1: {} | [], obj2: {} | []): boolean {
	if (!obj1 || !obj2) return false
	if (Array.isArray(obj1)) {
		if (Array.isArray(obj2) &&
			obj1.length == obj2.length
		) {
			for (let i = 0; i < obj1.length; i++) {
				return objectCompare(obj1[i], obj2[i])
			}
			return true
		} else {
			return false
		}
	} else {
		for (const p in obj1) {
			if (obj1.hasOwnProperty(p)) {
				// Check property exists on both objects
				if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
					return false;
				}
				switch (typeof (obj1[p])) {
					// Deep compare objects
					case 'object':
						if (!objectCompare(obj1[p], obj2[p])) return false
						break
					// skip function
					case 'function':
						break
					// Compare values
					default:
						if (obj1[p] != obj2[p]) return false
				}
			}
		}
		// Check object 2 for any extra properties
		for (const o in obj2) {
			if (typeof (obj1[o]) == 'undefined') {
				return false
			}
		}
		return true
	}
}

export function objectAssign<T extends object>(target: T, source: object): T
export function objectAssign<T extends object, U extends object>(target: T, source: U): T & U
export function objectAssign<T extends object, U extends object, V extends object>(target: T, source1: U, source2: V): T & U & V
export function objectAssign<T extends object, U extends object, V extends object, W extends object>(
	target: T, source1: U, source2?: V, source3?: W
): T & U & V & W {
	return Object.assign(target as T, source1 as U, source2 as V, source3 as W)
}

export function stringify(
	value: any,
	replacer?: (this: any, key: string, value: any) => any | (number | string)[] | null,
	space?: string | number
): string {
	return JSON.stringify(value, replacer, space)
}

export function parse<T>(text: string | null, reviver?: (this: any, key: string, value: any) => any): T {
	return JSON.parse(text as string, reviver)
}
