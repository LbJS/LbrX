import { Todo } from 'helpers/test-subjects'
import { Store } from 'lbrx'
import fetch from 'node-fetch'
import { from } from 'rxjs'

describe('Store initializeAsync():', () => {

  const geTodoItem = (): Promise<Todo> => fetch('https://jsonplaceholder.typicode.com/todos/1').then(r => r.json()).catch(() => { })
  let expectedTodoItem: Todo | null
  let store: Store<Todo>

  beforeEach(async () => {
    expectedTodoItem = await geTodoItem()
    const providerModule = await import('provider')
    store = providerModule.StoresFactory.createStore<Todo>(null)
  })

  jest.retryTimes(5)
  it('should get todo item from promise ajax call.', async () => {
    await store.initializeAsync(geTodoItem())
    expect(store.state).toStrictEqual(expectedTodoItem)
  })

  jest.retryTimes(5)
  it('should get todo item from observable ajax call.', async () => {
    await store.initializeAsync(from(geTodoItem()))
    expect(store.state).toStrictEqual(expectedTodoItem)
  })
})
