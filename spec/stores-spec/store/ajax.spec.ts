import { Store } from 'lbrx'
import fetch from 'node-fetch'
import { from } from 'rxjs'
import { Todo } from 'test-subjects'

describe('Store ajax call:', () => {

  const getData = (): Promise<Todo> => fetch('https://jsonplaceholder.typicode.com/todo1.json').then(r => r.json())
  let expectedTodo: Todo
  let store: Store<Todo>

  beforeEach(async () => {
    expectedTodo = await getData()
    const providerModule = await import('provider.module')
    store = providerModule.StoresFactory.createStore<Todo>(null)
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should get todo item from promise ajax call.', async () => {
    await store.initializeAsync(getData())
    expect(store.value).toStrictEqual(expectedTodo)
  })

  it('should get todo item from observable ajax call.', async () => {
    await store.initializeAsync(from(getData()))
    expect(store.value).toStrictEqual(expectedTodo)
  })
})
