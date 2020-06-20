import MockBuilder from './mock-builder'

// tslint:disable-next-line: no-namespace
declare namespace jasmine {
  interface CurrentTest {
    id: string
    description: string
    fullName: string
    failedExpectations: {
      actual: string
      error: Error
      expected: string
      matcherName: string
      message: string
      passed: boolean
      stack: string
    }[]
    passedExpectations: unknown[]
    pendingReason: string
    testPath: string
  }
  let currentTest: CurrentTest
  let getEnv: () => ({
    addReporter: (specObj: {
      specStarted: (currentTest: CurrentTest) => {},
      specDone: (currentTest: CurrentTest) => {}
    }) => {}
  })
}

jasmine.getEnv().addReporter({
  specStarted: result => jasmine.currentTest = result,
  specDone: result => jasmine.currentTest = result,
})

globalThis.afterEach(() => {
  // const currentTest = jasmine.currentTest
  jest.resetModules()
  jest.resetAllMocks()
  MockBuilder.deleteAllMocks()
})
