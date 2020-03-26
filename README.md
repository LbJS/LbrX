# LbrX - _alpha version_

This is an object oriented State Manager that's build for JavaScript applications that's based on RxJs. The api for querying th data is very similar to .Net EF LINQ but with observables. State updates can also be achieved with partial objects and we will merge the objects for you. Object instance preservation guaranteed if you're working with classes or dates. Unlinked object references guaranteed even with deep nested objects, no changes will apply to your state unintentionally. Two way data flow with no boilerplate code! We also support Redux DevTools for easier state debugging.

## Development progress:

- [x] Single object store
- [x] Class support
- [x] Local or session storage configuration per store
- [x] Reset-able stores support
- [x] Object compare configuration per store support for better performance with very large objects
- [x] Store hooks
- [x] Redux DevTools one way support
- [x] Redux DevTools both ways support
- [x] Deep nested objects support
- [x] Global default store configurations
- [x] Async initialization support (Promise and Observable)
- [ ] Full spec coverage of the above - wip
- [ ] Better playground on the repository - wip
- [ ] Partial documentation
- [ ] Serialization and denationalization configuration for browser storage
- [ ] **List Store**
- [ ] Full spec coverage of the above
- [ ] Full documentation

## Installation:

    npm i lbrx

## Example:

**Step 1: Initialization**

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

**Step 2: Create Store**

    @StoreConfig({
    	name: 'LEON-STORE',
    	objectCompareType: ObjectCompareTypes.advanced,
    	isResettable: true,
    	storageType: Storages.session,
    	storageDebounceTime: 500
    })
    class UserStore extends Store<User> {

    	constructor() {
    		super(createLeon())
    	}
    }

    const userStore = new UserStore()

**Step 3: Subscribe to changes**

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

    // User {firstName: "Leon", lastName: null, address: Address}
    // firstName: Leon
    // lastName: null
    // address: Hell of a place

**Step 4: Update Store**

Pay attention to the values that haven't been changed. They won't trigger their subscribers, thus preventing unnecessary performance hit.

    setTimeout(() => {
    	userStore.update({
    		firstName: 'Some other name',
    		lastName: 'My first lastName'
    	})
    }, 200)

    // User {firstName: "Some other name", lastName: "My first lastName", address: Address}
    // firstName: Some other name
    // lastName: My first lastName

    setTimeout(() => {
    	userStore.update({
    		firstName: 'Some other name',
    		lastName: 'My second lastName',
    		address: {
    			place: 'Some other place'
    		}
    	})
    }, 500)

    // User {firstName: "Some other name", lastName: "My second lastName", address: Address}
    // lastName: My second lastName
    // address: Some other place

    setTimeout(() => {
    	userStore.reset()
    }, 500)

    // User {firstName: "Leon", lastName: null, address: Address}
    // firstName: Leon
    // lastName: null
    // address: Hell of a place

    setTimeout(() => {
    	userStore.reset()
    }, 550)

**Step 5: Debug using Redux DevTools**

![ReduxDevTools](https://lh3.googleusercontent.com/8OTs0-DeqWlIGDU67xmLJCFm3gB2QVilTpUzpt3R_p-5BwS3Utam1VB18kIodxBxckO_CVUt-Ydpl41fJ4pAVspGvC0qWt8Xh3qRKUZweKTEFjQlhPvoep3xHcLSWFUj-RYJ7EeiyQ=w2400)
