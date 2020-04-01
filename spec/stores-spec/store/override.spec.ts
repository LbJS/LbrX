import { Store as Store_type } from 'lbrx'

describe('Store override:', () => {

	let Store: typeof Store_type

	beforeEach(async () => {
		const provider = (await import('provider')).default
		Store = provider.provide(Store_type.name)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it("should override the store's state value.", () => {

	})
})
