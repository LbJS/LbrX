import MockBuilder from './mock-builder'

globalThis.afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
  MockBuilder.deleteAllMocks()
})
