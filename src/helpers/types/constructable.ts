
// tslint:disable-next-line: ban-types
export interface Constructable<T> {
	// tslint:disable-next-line: callable-types
	new(...args: any[]): T
}
