import { Store } from 'lbrx'
import fetch from 'node-fetch'
import { from } from 'rxjs'
import { Todo } from 'test-subjects'

describe('Store ajax call:', () => { // TODO: refactor to firebase

  let wasAjaxError = false
  const getData = (): Promise<Todo> => fetch('https://jsonplaceholder.typicode.com/todos/1').then(r => r.json())
  let expectedTodo: Todo | null
  let store: Store<Todo>

  beforeEach(async () => {
    expectedTodo = await getData().catch(() => {
      if (!wasAjaxError) {
        console.warn('Store ajax call tests were skipped because of ajax call failure.')
        wasAjaxError = true
      }
      return null
    })
    const providerModule = await import('provider.module')
    store = providerModule.StoresFactory.createStore<Todo>(null)
  }, 500)

  afterEach(() => {
    jest.resetModules()
  })

  it('should get todo item from promise ajax call.', async () => {
    if (!expectedTodo) return
    await store.initializeAsync(getData())
    expect(store.value).toStrictEqual(expectedTodo)
  })

  it('should get todo item from observable ajax call.', async () => {
    if (!expectedTodo) return
    await store.initializeAsync(from(getData()))
    expect(store.value).toStrictEqual(expectedTodo)
  })
})
