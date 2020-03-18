import { LbrXManager, StoreConfig, Store, Storages } from 'lbrx'

const PROD_MODE = false
if (PROD_MODE) LbrXManager.enableProdMode()
LbrXManager.initializeDevTools()

class Address {
	place: string | null = null
}

class User {
	firstName: string | null = null
	lastName: string | null = null
	address: Address | null = null
}

function createLeon(): User {
	return Object.assign(new User(), {
		firstName: 'Leon',
		address: Object.assign(new Address(), {
			place: 'Hell of a place'
		})
	})
}

@StoreConfig({
	name: 'LEON-STORE',
	doObjectCompare: true,
	isResettable: true,
	storage: {
		type: Storages.session,
		debounceTime: 2000
	}
})
class UserStore extends Store<User> {

	constructor() {
		super(createLeon())
	}
}

const userStore = new UserStore()

userStore
	.select()
	.subscribe(x => console.log(x))
userStore
	.select(state => state.firstName)
	.subscribe(x => console.log('firstName: ' + x))
userStore
	.select(state => state.lastName)
	.subscribe(x => console.log('lastName: ' + x))
userStore
	.select(state => state.address?.place)
	.subscribe(x => console.log('address: ' + x))

setTimeout(() => {
	userStore.update({
		firstName: 'Some other name',
		lastName: 'My first lastName'
	})
}, 200)

setTimeout(() => {
	userStore.update({
		firstName: 'Some other name',
		lastName: 'My second lastName',
		address: {
			place: 'Some other place'
		}
	})
}, 500)

setTimeout(() => {
	userStore.reset()
}, 500)

setTimeout(() => {
	userStore.reset()
}, 550)
