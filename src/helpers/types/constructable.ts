
// tslint:disable-next-line: ban-types
export interface Constructable<T> extends Function {
	// tslint:disable-next-line: callable-types
	new(...args: any[]): T
}
