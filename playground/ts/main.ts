import { Actions, ObjectCompareTypes, Storages, Store, StoreConfig } from 'lbrx'
import { LbrXManager } from 'lbrx/core'
import { of } from 'rxjs'

const PROD_MODE = false
if (PROD_MODE) LbrXManager.enableProdMode()
LbrXManager.initializeDevTools({ displayValueAsState: true, showStackTrace: false })

class Address {
  place: string | null = null
}

class User {
  firstName: string | null = null
  lastName: string | null = null
  address: Address | null = null
  date: Date = new Date()
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
  objectCompareType: ObjectCompareTypes.advanced,
  isResettable: true,
  storageType: Storages.session,
  storageDebounceTime: 500
})
class UserStore extends Store<User> {

  constructor() {
    super(createLeon())
  }

  public onBeforeInit(initialState: User): void {
    console.log('ON BEFORE INIT: ', initialState)
  }
}

@StoreConfig({
  name: 'BETTER-LEON-STORE',
  objectCompareType: ObjectCompareTypes.advanced,
  isResettable: true,
  storageType: Storages.session,
  storageDebounceTime: 500
})
class BetterUserStore extends Store<User> {

  constructor() {
    super(createLeon())
  }
}

const userStore = new UserStore()
const betterUserStore = new BetterUserStore()

userStore
  .onAction(Actions.update)
  .select$(state => state.firstName)
  .subscribe(x => console.log('-----Update only: ' + x))

userStore
  .select$()
  .subscribe(x => console.log(x))
userStore
  .select$(state => state.firstName)
  .subscribe(x => console.log('firstName: ' + x))
userStore
  .select$(state => state.lastName)
  .subscribe(x => console.log('lastName: ' + x))
userStore
  .select$(state => state.address?.place)
  .subscribe(x => console.log('address: ' + x))

userStore
  .select$<[string | null, string | null, Date]>([state => state.firstName, state => state.lastName, state => state.date])
  .subscribe(x => console.log(x))

userStore
  .isLoading$.subscribe(value => {
    if (!value) {
      console.log('From is loading: ', userStore.value)
    }
  })
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
  userStore.override({
    firstName: 'Some other name1',
    lastName: 'My second lastName1',
    date: new Date(),
    address: {
      place: 'Some other place1'
    }
  })
}, 510)

setTimeout(() => {
  userStore.reset()
}, 530)

setTimeout(() => {
  userStore.reset()
}, 550)

setTimeout(async () => {
  (await userStore.hardReset())
    .initializeAsync(of(createLeon()))
}, 600)

setTimeout(() => {
  userStore.isPaused = true
}, 800)

setTimeout(() => {
  userStore.isPaused = false
}, 850)

setTimeout(() => {
  userStore.override({
    firstName: 'Some other name1',
    lastName: 'My second lastName1',
    date: new Date(),
    address: {
      place: 'Some other place1'
    }
  })
}, 5000)

setTimeout(() => {
  userStore.update(x => ({ firstName: x.firstName + '123' }))
}, 10000)

setTimeout(() => {
  userStore.update(x => ({ firstName: x.firstName + '4' }))
}, 10010)
