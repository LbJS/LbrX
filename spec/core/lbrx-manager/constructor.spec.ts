

describe(`LbrXManager - constructor:`, () => {

  let LbrXManager: any

  beforeEach(async () => {
    const provider = await import(`provider`)
    LbrXManager = provider.LbrXManager
  })

  it(`initializing private constructor just for coverage.`, () => {
    // tslint:disable-next-line: no-unused-expression
    new LbrXManager()
  })
})
