import { freezeDate as freezeDate_type } from 'lbrx/utils'


describe('Helper Function - freezeDate():', () => {

  let freezeDate: typeof freezeDate_type

  beforeEach(async () => {
    const provider = await import('provider')
    freezeDate = provider.freezeDate
  })

  it("should throw on date's modification.", () => {
    const date = new Date()
    freezeDate(date)
    expect(() => { date.setTime(1) }).toThrow()
    expect(() => { date.setDate(1) }).toThrow()
    expect(() => { date.setFullYear(1) }).toThrow()
    expect(() => { date.setHours(1) }).toThrow()
    expect(() => { date.setMilliseconds(1) }).toThrow()
    expect(() => { date.setMinutes(1) }).toThrow()
    expect(() => { date.setMonth(1) }).toThrow()
    expect(() => { date.setSeconds(1) }).toThrow()
    expect(() => { date.setUTCDate(1) }).toThrow()
    expect(() => { date.setUTCFullYear(1) }).toThrow()
    expect(() => { date.setUTCHours(1) }).toThrow()
    expect(() => { date.setUTCMilliseconds(1) }).toThrow()
    expect(() => { date.setUTCMinutes(1) }).toThrow()
    expect(() => { date.setUTCMonth(1) }).toThrow()
    expect(() => { date.setUTCSeconds(1) }).toThrow()
  })

  it('should throw on returned value modification.', () => {
    const date = new Date()
    const returnedDate = freezeDate(date)
    expect(() => { returnedDate.setTime(1) }).toThrow()
    expect(() => { returnedDate.setDate(1) }).toThrow()
    expect(() => { returnedDate.setFullYear(1) }).toThrow()
    expect(() => { returnedDate.setHours(1) }).toThrow()
    expect(() => { returnedDate.setMilliseconds(1) }).toThrow()
    expect(() => { returnedDate.setMinutes(1) }).toThrow()
    expect(() => { returnedDate.setMonth(1) }).toThrow()
    expect(() => { returnedDate.setSeconds(1) }).toThrow()
    expect(() => { returnedDate.setUTCDate(1) }).toThrow()
    expect(() => { returnedDate.setUTCFullYear(1) }).toThrow()
    expect(() => { returnedDate.setUTCHours(1) }).toThrow()
    expect(() => { returnedDate.setUTCMilliseconds(1) }).toThrow()
    expect(() => { returnedDate.setUTCMinutes(1) }).toThrow()
    expect(() => { returnedDate.setUTCMonth(1) }).toThrow()
    expect(() => { returnedDate.setUTCSeconds(1) }).toThrow()
  })

  it('should not throw on non strict mode.', async () => {
    jest.spyOn(globalThis, 'eval').mockImplementationOnce(jest.fn().mockReturnValue(false))
    const date = new Date()
    const returnedDate = freezeDate(date)
    expect(() => { date.setTime(1) }).not.toThrow()
    expect(() => { date.setDate(1) }).not.toThrow()
    expect(() => { date.setFullYear(1) }).not.toThrow()
    expect(() => { date.setHours(1) }).not.toThrow()
    expect(() => { date.setMilliseconds(1) }).not.toThrow()
    expect(() => { date.setMinutes(1) }).not.toThrow()
    expect(() => { date.setMonth(1) }).not.toThrow()
    expect(() => { date.setSeconds(1) }).not.toThrow()
    expect(() => { date.setUTCDate(1) }).not.toThrow()
    expect(() => { date.setUTCFullYear(1) }).not.toThrow()
    expect(() => { date.setUTCHours(1) }).not.toThrow()
    expect(() => { date.setUTCMilliseconds(1) }).not.toThrow()
    expect(() => { date.setUTCMinutes(1) }).not.toThrow()
    expect(() => { date.setUTCMonth(1) }).not.toThrow()
    expect(() => { date.setUTCSeconds(1) }).not.toThrow()
    expect(() => { returnedDate.setTime(1) }).not.toThrow()
    expect(() => { returnedDate.setDate(1) }).not.toThrow()
    expect(() => { returnedDate.setFullYear(1) }).not.toThrow()
    expect(() => { returnedDate.setHours(1) }).not.toThrow()
    expect(() => { returnedDate.setMilliseconds(1) }).not.toThrow()
    expect(() => { returnedDate.setMinutes(1) }).not.toThrow()
    expect(() => { returnedDate.setMonth(1) }).not.toThrow()
    expect(() => { returnedDate.setSeconds(1) }).not.toThrow()
    expect(() => { returnedDate.setUTCDate(1) }).not.toThrow()
    expect(() => { returnedDate.setUTCFullYear(1) }).not.toThrow()
    expect(() => { returnedDate.setUTCHours(1) }).not.toThrow()
    expect(() => { returnedDate.setUTCMilliseconds(1) }).not.toThrow()
    expect(() => { returnedDate.setUTCMinutes(1) }).not.toThrow()
    expect(() => { returnedDate.setUTCMonth(1) }).not.toThrow()
    expect(() => { returnedDate.setUTCSeconds(1) }).not.toThrow()
  })

  it('should not be modified.', async () => {
    jest.spyOn(globalThis, 'eval').mockImplementationOnce(jest.fn().mockReturnValue(false))
    const date = new Date()
    const expectedDate = new Date(date)
    const returnedDate = freezeDate(date)
    try { date.setTime(1) } catch { }
    try { date.setDate(1) } catch { }
    try { date.setFullYear(1) } catch { }
    try { date.setHours(1) } catch { }
    try { date.setMilliseconds(1) } catch { }
    try { date.setMinutes(1) } catch { }
    try { date.setMonth(1) } catch { }
    try { date.setSeconds(1) } catch { }
    try { date.setUTCDate(1) } catch { }
    try { date.setUTCFullYear(1) } catch { }
    try { date.setUTCHours(1) } catch { }
    try { date.setUTCMilliseconds(1) } catch { }
    try { date.setUTCMinutes(1) } catch { }
    try { date.setUTCMonth(1) } catch { }
    try { date.setUTCSeconds(1) } catch { }
    try { returnedDate.setTime(1) } catch { }
    try { returnedDate.setDate(1) } catch { }
    try { returnedDate.setFullYear(1) } catch { }
    try { returnedDate.setHours(1) } catch { }
    try { returnedDate.setMilliseconds(1) } catch { }
    try { returnedDate.setMinutes(1) } catch { }
    try { returnedDate.setMonth(1) } catch { }
    try { returnedDate.setSeconds(1) } catch { }
    try { returnedDate.setUTCDate(1) } catch { }
    try { returnedDate.setUTCFullYear(1) } catch { }
    try { returnedDate.setUTCHours(1) } catch { }
    try { returnedDate.setUTCMilliseconds(1) } catch { }
    try { returnedDate.setUTCMinutes(1) } catch { }
    try { returnedDate.setUTCMonth(1) } catch { }
    try { returnedDate.setUTCSeconds(1) } catch { }
    expect(date).toStrictEqual(expectedDate)
    expect(returnedDate).toStrictEqual(expectedDate)
  })

  it('should not be modified on non strict mode.', async () => {
    jest.spyOn(globalThis, 'eval').mockImplementationOnce(jest.fn().mockReturnValue(false))
    const date = new Date()
    const expectedDate = new Date(date)
    const returnedDate = freezeDate(date)
    date.setTime(1)
    date.setDate(1)
    date.setFullYear(1)
    date.setHours(1)
    date.setMilliseconds(1)
    date.setMinutes(1)
    date.setMonth(1)
    date.setSeconds(1)
    date.setUTCDate(1)
    date.setUTCFullYear(1)
    date.setUTCHours(1)
    date.setUTCMilliseconds(1)
    date.setUTCMinutes(1)
    date.setUTCMonth(1)
    date.setUTCSeconds(1)
    returnedDate.setTime(1)
    returnedDate.setDate(1)
    returnedDate.setFullYear(1)
    returnedDate.setHours(1)
    returnedDate.setMilliseconds(1)
    returnedDate.setMinutes(1)
    returnedDate.setMonth(1)
    returnedDate.setSeconds(1)
    returnedDate.setUTCDate(1)
    returnedDate.setUTCFullYear(1)
    returnedDate.setUTCHours(1)
    returnedDate.setUTCMilliseconds(1)
    returnedDate.setUTCMinutes(1)
    returnedDate.setUTCMonth(1)
    returnedDate.setUTCSeconds(1)
    expect(date).toStrictEqual(expectedDate)
    expect(returnedDate).toStrictEqual(expectedDate)
  })

  it('should return the same date.', () => {
    const date = new Date()
    const returnedDate = freezeDate(date)
    expect(returnedDate).toBe(date)
  })
})
