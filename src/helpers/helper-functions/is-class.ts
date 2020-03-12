interface Constructable<T = {}> {
	// tslint:disable-next-line: callable-types
	new(...args: any[]): T;
}

export function isClass<T = {}>(value: {}): value is Constructable<T> {
	return value.constructor.name !== 'Object'
}
