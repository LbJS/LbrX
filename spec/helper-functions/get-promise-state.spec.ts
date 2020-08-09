import { getPromiseState, PromiseStates } from 'lbrx/utils'

describe('Helper Function - getPromiseState():', () => {

  it('should return fulfilled for resolved promise.', async () => {
    const resolvedPromise = Promise.resolve()
    expect(await getPromiseState(resolvedPromise)).toBe(PromiseStates.fulfilled)
  })

  it('should return rejected for rejected promise.', async () => {
    const rejectedPromise = Promise.reject()
    expect(await getPromiseState(rejectedPromise)).toBe(PromiseStates.rejected)
  })

  it('should return pending for pending promise.', async () => {
    const pendingPromise = new Promise(() => { })
    expect(await getPromiseState(pendingPromise)).toBe(PromiseStates.pending)
  })
})
