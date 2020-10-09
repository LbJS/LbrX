import { newDate } from 'lbrx/utils'

describe('Short Hand Function - newDate():', () => {

  it("should call Date's constructor.", () => {
    const dateSpy = jest.spyOn(globalThis, 'Date').mockImplementationOnce(jest.fn())
    newDate()
    expect(dateSpy).toBeCalledTimes(1)
  })

  it('should return the expected Date.', () => {
    let refDate = new Date()
    let resultDate = newDate()
    expect(resultDate).toBeInstanceOf(Date)
    expect(refDate.getTime()).toBeLessThanOrEqual(resultDate.getTime())
    const isoDate = '2020-09-09T18:43:20.354Z'
    refDate = new Date(isoDate)
    resultDate = newDate(isoDate)
    expect(resultDate).toStrictEqual(refDate)
    const ms = 1602258402073
    refDate = new Date(ms)
    resultDate = newDate(ms)
    expect(resultDate).toStrictEqual(refDate)
    const date = new Date()
    refDate = new Date(date)
    resultDate = newDate(date)
    expect(resultDate).toStrictEqual(refDate)
    refDate = new Date(date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds())
    resultDate = newDate(date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds())
    expect(resultDate).toStrictEqual(refDate)
  })
})
