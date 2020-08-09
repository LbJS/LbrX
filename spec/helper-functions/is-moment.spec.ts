import { isMoment } from 'lbrx/utils'
import moment from 'moment'

describe('Helper Function - isMoment():', () => {

  it('should return true for moment object.', () => {
    expect(isMoment(moment())).toBeTruthy()
  })

  it('should return false for Date object.', () => {
    expect(isMoment(new Date())).toBeFalsy()
  })

  it('should return false for plain object.', () => {
    expect(isMoment({})).toBeFalsy()
  })

  it('should return false for moment function.', () => {
    expect(isMoment(moment)).toBeFalsy()
  })

  it('should return false for undefined.', () => {
    expect(isMoment(undefined)).toBeFalsy()
  })

  it('should return false for null.', () => {
    expect(isMoment(null)).toBeFalsy()
  })
})
