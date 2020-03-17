
export class Person {
	firstName: string | null
	lastName: string | null
	birthday: Date | null
	someDate: Date | null
	someOtherDate: Date | null
	address: {
		country?: string | null
		state?: string | null
		region?: string | null
		city?: string | null
		street?: string | null
		homeNumber?: number | string | null
	} | null
	emails: string[] | null
	nestedObject: {
		nestedValue: {
			randomList: any[]
		}
	} | null
	func: (() => void) | null

	constructor({
		firstName = null,
		lastName = null,
		birthday = null,
		someDate = null,
		someOtherDate = null,
		address = null,
		emails = null,
		nestedObject = null,
		func = null
	}: Partial<Person>
	) {
		this.firstName = firstName
		this.lastName = lastName
		this.birthday = birthday
		this.someDate = someDate
		this.someOtherDate = someOtherDate
		this.address = address
		this.emails = emails
		this.nestedObject = nestedObject
		this.func = func
	}
}

export class BetterPerson extends Person {
	betterDate: Date | null

	constructor({
		firstName = null,
		lastName = null,
		birthday = null,
		someDate = null,
		someOtherDate = null,
		betterDate = null,
		address = null,
		emails = null,
		nestedObject = null,
		func = null,
	}: Partial<BetterPerson>
	) {
		super({
			firstName,
			lastName,
			birthday,
			someDate,
			someOtherDate,
			address,
			emails,
			nestedObject,
			func
		})
		this.betterDate = betterDate
	}
}
