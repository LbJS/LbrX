import { isCalledBy as isCalledBy_type } from 'lbrx/utils'

describe(`Helper Function - isCalledBy():`, () => {

  let isCalledBy: typeof isCalledBy_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    isCalledBy = provider.isCalledBy
  })

  it(`should be called by the provided method name.`, () => {
    function methodA(name: string, index?: number): boolean {
      return methodB(name, index)
    }
    function methodB(name: string, index?: number): boolean {
      return methodC(name, index)
    }
    function methodC(name: string, index?: number): boolean {
      return isCalledBy(name, index)
    }
    expect(methodB(`methodB`)).toBeTruthy()
    expect(methodA(`methodA`, 1)).toBeTruthy()
  })

  it(`should not be called by the provided method name.`, () => {
    function methodA(name: string, index?: number): boolean {
      return methodB(name, index)
    }
    function methodB(name: string, index?: number): boolean {
      return methodC(name, index)
    }
    function methodC(name: string, index?: number): boolean {
      return isCalledBy(name, index)
    }
    expect(methodB(`methodC`)).toBeFalsy()
    expect(methodA(`methodA`, 0)).toBeFalsy()
  })

  it(`should return false if no stack trace.`, () => {
    jest.spyOn(globalThis, `Error`).mockImplementationOnce(jest.fn())
    function methodA(name: string, index?: number): boolean {
      return methodB(name, index)
    }
    function methodB(name: string, index?: number): boolean {
      return methodC(name, index)
    }
    function methodC(name: string, index?: number): boolean {
      return isCalledBy(name, index)
    }
    expect(methodB(`methodB`)).toBeFalsy()
    expect(methodA(`methodA`, 1)).toBeFalsy()
  })
})
