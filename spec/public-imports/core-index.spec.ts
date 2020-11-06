
// tslint:disable: deprecation
// tslint:disable: no-unused-expression
describe(`core index:`, () => {

  it(`should include the expected imports.`, async () => {
    const core = await import(`lbrx/core`)
    expect(core.LbrXManager).toBeTruthy()
  })
})
