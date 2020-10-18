import { throwError } from 'lbrx/utils'

describe(`Helper Function - throwError():`, () => {

  it(`should throw error if an error is provided.`, () => {
    const error = new Error(`Some Error`)
    expect(() => {
      throwError(error)
    }).toThrow(error)
  })

  it(`should create an error from string and throw it if a string is provided.`, () => {
    const error = new Error(`Some Error`)
    expect(() => {
      throwError(error.message)
    }).toThrow(error)
  })
})
