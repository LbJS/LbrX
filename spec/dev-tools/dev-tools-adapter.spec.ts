import { DevToolsAdapter } from 'lbrx/internal/dev-tools'
import { Subject } from 'rxjs'

describe(`Dev Tools Adapter:`, () => {

  it(`should include stores object.`, () => {
    expect(typeof DevToolsAdapter.stores).toBe(`object`)
  })

  it(`should include states object.`, () => {
    expect(typeof DevToolsAdapter.states).toBe(`object`)
  })

  it(`should include values object.`, () => {
    expect(typeof DevToolsAdapter.values).toBe(`object`)
  })

  it(`should include state change Subject.`, () => {
    expect(DevToolsAdapter.stateChange$).toBeInstanceOf(Subject)
  })
})
