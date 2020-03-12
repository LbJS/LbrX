export function objectAssign<T extends object>(target: T, source: object): T
export function objectAssign<T extends object, U extends object>(target: T, source: U): T & U
export function objectAssign<T extends object, U extends object, V extends object>(target: T, source1: U, source2: V): T & U & V
export function objectAssign<T extends object, U extends object, V extends object, W extends object>(
	target: T, source1: U, source2?: V, source3?: W
): T & U & V & W {
	return Object.assign(target as T, source1 as U, source2 as V, source3 as W)
}
