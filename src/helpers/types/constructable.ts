
// tslint:disable-next-line: ban-types
export interface Constructable {
	// tslint:disable-next-line: callable-types
	// new(...args: any[]): T, // <= old
	// tslint:disable-next-line: no-misused-new
	constructor(...args: any[]): void
}
