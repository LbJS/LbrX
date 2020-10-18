import { parse } from 'lbrx/internal/helpers'

describe('Short Hand Function - parse():', () => {

  it('should parse json string to object.', () => {
    const jsonString = '{"firstName":"mike","lastName":"test"}'
    expect(parse(jsonString)).toStrictEqual(JSON.parse(jsonString))
  })

  it('should parse json string to object using reviver.', () => {
    const jsonString = '{"firstName":"mike","lastName":"test"}'
    const reviver = (key: string, value: unknown) => {
      return key == 'lastName' ? 'test' : value
    }
    expect(parse(jsonString, reviver)).toStrictEqual(JSON.parse(jsonString, reviver))
  })

  it('should return null if null is provided', () => {
    expect(parse(null)).toBeNull()
  })
})
