import { PROD_MODE } from 'environment'
import { LbrXManager } from 'lbrx/core'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

if (PROD_MODE) LbrXManager.enableProdMode()
LbrXManager.initializeDevTools({ showStackTrace: false })

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById(`app-root`)
)




// import { ListStore, ListStoreConfig } from 'lbrx'
// import { LbrXManager, SortDirections } from 'lbrx/core'

// const PROD_MODE = false
// if (PROD_MODE) LbrXManager.enableProdMode()
// LbrXManager.initializeDevTools({ showStackTrace: false })

// const TODO_LIST: TodoItem[] = [
//   {
//     id: 1,
//     name: `abc`,
//     done: false,
//   },
//   {
//     id: 2,
//     name: `abc`,
//     done: true,
//   },
//   {
//     id: 3,
//     name: `abc`,
//     done: false,
//   }
// ]

// interface TodoItem {
//   id: number
//   name: string
//   done: boolean
// }

// @ListStoreConfig({
//   name: `TODO-STORE`,
//   idKey: `id`
// })
// class TodoStore extends ListStore<TodoItem, `id`> {
//   constructor() {
//     super(TODO_LIST)
//   }
// }

// const todoStore = new TodoStore()

// todoStore.where(x => x.id >= 2).orderBy({ key: `id`, dir: SortDirections.DESC }).toList$().subscribe(d => console.log(d))

// console.log(todoStore.value)

// class Address {
//   place: string | null = null
// }

// class User {
//   firstName: string | null = null
//   lastName: string | null = null
//   address: Address | null = null
//   date: Date = new Date()
// }

// function createLeon(): User {
//   return Object.assign(new User(), {
//     firstName: `Leon`,
//     address: Object.assign(new Address(), {
//       place: `Hell of a place`
//     })
//   })
// }

// @StoreConfig({
//   name: `LEON-STORE`,
//   objectCompareType: ObjectCompareTypes.advanced,
//   isResettable: true,
//   storageType: Storages.session,
//   storageDebounceTime: 500
// })
// class UserStore extends Store<User> {

//   constructor() {
//     super(createLeon())
//   }

//   public onBeforeInit(initialState: User): void {
//     console.log(`ON BEFORE INIT: `, initialState)
//   }
// }

// @StoreConfig({
//   name: `BETTER-LEON-STORE`,
//   objectCompareType: ObjectCompareTypes.advanced,
//   isResettable: true,
//   storageType: Storages.session,
//   storageDebounceTime: 500
// })
// class BetterUserStore extends Store<User> {

//   constructor() {
//     super(createLeon())
//   }
// }

// const userStore = new UserStore()
// const betterUserStore = new BetterUserStore();

// (betterUserStore as QueryableStore<User>)
//   .onAction(Actions.update)
//   .get$(x => x.address)
//   .subscribe(x => console.log(x))

// userStore
//   .onAction(Actions.update)
//   .get$(state => state.firstName)
//   .subscribe(x => console.log(`-----Update only: ` + x))

// userStore
//   .get$()
//   .subscribe(x => console.log(x))
// userStore
//   .get$(state => state.firstName)
//   .subscribe(x => console.log(`firstName: ` + x))
// userStore
//   .get$(`lastName`)
//   .subscribe(x => console.log(`lastName: ` + x))
// userStore
//   .get$(state => getNestedProp(state, `address`, `place`))
//   .subscribe(x => console.log(`address: ` + x))

// userStore
//   .get$([`date`, `address`])
//   .subscribe(x => console.log(x))

// userStore
//   .get$<[string | null, string | null, Date]>([state => state.firstName, state => state.lastName, state => state.date])
//   .subscribe(x => console.log(x))

// userStore
//   .isLoading$.subscribe(value => {
//     if (!value) {
//       console.log(`From is loading: `, userStore.value)
//     }
//   })
// setTimeout(() => {
//   userStore.update({
//     firstName: `Some other name`,
//     lastName: `My first lastName`
//   })
// }, 200)

// setTimeout(() => {
//   userStore.update({
//     address: null
//   })
// }, 250)

// setTimeout(() => {
//   userStore.update({
//     firstName: `Some other name`,
//     lastName: `My second lastName`,
//     address: {
//       place: `Some other place`
//     }
//   })
// }, 500)

// setTimeout(() => {
//   userStore.set({
//     firstName: `Some other name1`,
//     lastName: `My second lastName1`,
//     date: new Date(),
//     address: {
//       place: `Some other place1`
//     }
//   })
// }, 510)

// setTimeout(() => {
//   userStore.reset()
// }, 530)

// setTimeout(() => {
//   userStore.reset()
// }, 550)

// setTimeout(async () => {
//   (await userStore.hardReset())
//     .initializeAsync(of(createLeon()))
// }, 600)

// setTimeout(() => {
//   userStore.isPaused = true
// }, 800)

// setTimeout(() => {
//   userStore.isPaused = false
// }, 850)

// setTimeout(() => {
//   userStore.set({
//     firstName: `Some other name1`,
//     lastName: `My second lastName1`,
//     date: new Date(),
//     address: {
//       place: `Some other place1`
//     }
//   })
// }, 5000)

// setTimeout(() => {
//   userStore.update(x => ({ firstName: x.firstName + `123` }))
// }, 10000)

// setTimeout(() => {
//   userStore.update(x => ({ firstName: x.firstName + `4` }))
// }, 10010)

// setTimeout(() => {
//   userStore.error = new Error(`Some error`)
// }, 10015)
