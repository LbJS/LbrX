import { activateStreamToDevTools as activateStreamToDevTools_type, isDevTools as isDevTools_type } from 'lbrx/internal/dev-tools'

describe(`Dev Tools Mode:`, () => {

  let activateStreamToDevTools: typeof activateStreamToDevTools_type
  let isDevTools: typeof isDevTools_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    activateStreamToDevTools = provider.activateStreamToDevTools
    isDevTools = provider.isDevTools
  })

  it(`should inactive by default.`, () => {
    expect(isDevTools()).toBeFalsy()
  })

  it(`should activated after enabling pushes.`, () => {
    activateStreamToDevTools()
    expect(isDevTools()).toBeTruthy()
  })
})
