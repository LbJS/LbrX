import { Person } from './person.model'

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
