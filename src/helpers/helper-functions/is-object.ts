export function isObject(value: any): value is {} {
	return value && typeof value == 'object'
}
