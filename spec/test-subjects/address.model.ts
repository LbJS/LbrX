
export class Address {
	country?: string | null
	state?: string | null
	region?: string | null
	city?: string | null
	street?: string | null
	homeNumber?: number | string | null

	constructor({
		country = null,
		state = null,
		region = null,
		city = null,
		street = null,
		homeNumber = null,
	}: Partial<Address>) {
		this.country = country
		this.state = state
		this.region = region
		this.city = city
		this.state = street
		this.homeNumber = homeNumber
	}
}
