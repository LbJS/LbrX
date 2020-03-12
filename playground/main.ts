import { LbrXManager, StoreConfig, Store } from "../src"

LbrXManager.initializeDevTools()

interface User {
	firstName: string,
	lastName: string
}

@StoreConfig({
	storeName: 'LEON-STORE'
})
class UserStore extends Store<User> {

	constructor() {
		super({
			firstName: 'Leon',
			lastName: 'Bernstein',
		})
	}
}

// tslint:disable-next-line: no-unused-expression
new UserStore()
