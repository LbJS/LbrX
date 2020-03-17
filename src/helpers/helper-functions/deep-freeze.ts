function dateThrow(this: Date): never {
	throw new Error(`This date: "${this.toLocaleString()}" is read only.`)
}

export function deepFreeze<T extends {}>(object: T): Readonly<T> {
	for (const name of Object.getOwnPropertyNames(object)) {
		const value = object[name]
		if (value instanceof Date) {
			value.setTime = dateThrow
			value.setFullYear = dateThrow
			value.setMonth = dateThrow
			value.setDate = dateThrow
			value.setHours = dateThrow
			value.setMinutes = dateThrow
			value.setMilliseconds = dateThrow
			value.setUTCFullYear = dateThrow
			value.setUTCMonth = dateThrow
			value.setUTCDate = dateThrow
			value.setUTCHours = dateThrow
			value.setUTCMinutes = dateThrow
			value.setUTCMilliseconds = dateThrow
		} else if (value && typeof value == 'object') {
			object[name] = deepFreeze(value)
		}
	}
	return Object.freeze(object)
}
