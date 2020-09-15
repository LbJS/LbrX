import MockBuilder from '../mock-builder'

globalThis.afterEach(() => {
  // const currentTest = jasmine.currentTest
  jest.resetModules()
  jest.restoreAllMocks()
  MockBuilder.deleteAllMocks()
})
