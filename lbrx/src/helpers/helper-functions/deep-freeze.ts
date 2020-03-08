export function deepFreeze<T extends {}>(object: T): Readonly<T> {
	for (const name of Object.getOwnPropertyNames(object)) {
		const value = object[name]
		if (value && typeof value == 'object') {
			object[name] = deepFreeze(value)
		}
	}
	return Object.freeze(object);
}
