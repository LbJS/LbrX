import { getOwnPropertyNames } from '../shortened-functions'
import { isStrict } from './is-strict'
import { throwError } from './throw-error'

let _dateSettersMethodsKeys: string[] | null = null

export function freezeDate(value: Date): Readonly<Date> {
  if (!_dateSettersMethodsKeys) {
    _dateSettersMethodsKeys = getOwnPropertyNames(Date.prototype).filter(x => x.startsWith(`set`))
  }
  _dateSettersMethodsKeys.forEach(key => {
    value[key] = isStrict() ? () => { throwError(`Date: "${value.toString()}" is readonly`) } : () => { }
  })
  return value
}
