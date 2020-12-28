
// tslint:disable: deprecation
// tslint:disable: no-unused-expression
describe(`lbrx index:`, () => {

  it(`should include the expected imports.`, async () => {
    const lbrx = await import(`lbrx`)
    expect(lbrx.BaseStore).toBeTruthy()
    expect(lbrx.Store).toBeTruthy()
    expect(lbrx.ListStore).toBeTruthy()
    expect(lbrx.StoreConfig).toBeTruthy()
    expect(lbrx.StoreContext).toBeTruthy()
    expect(() => {
      lbrx.Actions.update
      lbrx.ObjectCompareTypes.simple
      lbrx.Storages.none
      lbrx.StoreTags.loading
    }).not.toThrow()
  })
})
