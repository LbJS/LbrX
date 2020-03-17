import { LbrXManager, StoreConfig, Store } from '../src'

LbrXManager.initializeDevTools()

interface User {
	firstName: string,
	lastName: string
}

@StoreConfig({
	name: 'LEON-STORE',
	// doObjectCompare: true,
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
const testStore = new UserStore()

testStore.select(state => state.firstName).subscribe(x => console.log(x))

testStore.select().subscribe(x => console.log(x))

setTimeout(() => {
	testStore.update({ firstName: 'Leon A' })
}, 200)
