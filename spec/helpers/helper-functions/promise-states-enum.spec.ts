import { PromiseStates } from 'lbrx/utils'

describe('Promise states enum:', () => {

  it('should contain a pending key with "pending" as value.', () => {
    expect(PromiseStates.pending).toBe('pending')
  })

  it('should contain a fulfilled key with "fulfilled" as value.', () => {
    expect(PromiseStates.fulfilled).toBe('fulfilled')
  })

  it('should contain a rejected key with "rejected" as value.', () => {
    expect(PromiseStates.rejected).toBe('rejected')
  })
})
