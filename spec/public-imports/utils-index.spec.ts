
// tslint:disable: deprecation
// tslint:disable: no-unused-expression
describe(`utils index:`, () => {

  it(`should include the expected imports.`, async () => {
    const helperFunctions = await import(`lbrx/internal/helpers/helper-functions`)
    const shortenedFunctions = await import(`lbrx/internal/helpers/shortened-functions`)
    const expectedUtilKeys = [...Object.keys(helperFunctions), ...Object.keys(shortenedFunctions)]
    const utils = await import(`lbrx/utils`)
    expectedUtilKeys.forEach(expectedUtilKey => {
      expect(Object.keys(utils)).toContain(expectedUtilKey)
    })
  })
})
