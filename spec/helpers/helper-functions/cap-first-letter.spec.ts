import { capFirstLetter } from 'lbrx/utils'

describe(`Helper Function - capFirstLetter():`, () => {

  it(`should capitalize the first letter.`, () => {
    const text = `hello world`
    const expectedText = `Hello world`
    expect(capFirstLetter(text)).toBe(expectedText)
  })

  it(`should capitalize even if  only one letter.`, () => {
    const letter = `a`
    const expectedLetter = `A`
    expect(capFirstLetter(letter)).toBe(expectedLetter)
  })

  it(`should return an empty string if an empty string is provided.`, () => {
    const str = ``
    const expectedStr = ``
    expect(capFirstLetter(str)).toBe(expectedStr)
  })

  it(`should return undefined if undefined is provided.`, () => {
    expect(capFirstLetter(undefined!)).toBe(undefined)
  })

  it(`should return null if null is provided.`, () => {
    expect(capFirstLetter(null!)).toBe(null)
  })
})
