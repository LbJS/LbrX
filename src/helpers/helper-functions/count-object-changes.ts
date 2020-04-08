import { isArray, isDate, isFunction, isNull, isObject, isUndefined, objectKeys } from 'lbrx/helpers'

export function countObjectChanges(objA: object | unknown[], objB: object | unknown[]): number {
  if (isNull(objA) || isNull(objB)) return objA === objB ? 0 : 1
  if (isDate(objA) || isDate(objB)) return isDate(objA) && isDate(objB) && objA.getTime() == objB.getTime() ? 0 : 1
  let changesCount = 0
  const comparisonHelper = (x: unknown, y: unknown): void => {
    if (isObject(x)) {
      if (isObject(y)) {
        changesCount += countObjectChanges(x, y)
      } else {
        changesCount++
      }
    } else if (isFunction(x) || isFunction(y)) {
      if (isFunction(x) != isFunction(y)) changesCount++
    } else if (x !== y) {
      changesCount++
    }
  }
  if (isArray(objA)) {
    if (isArray(objB)) {
      objA.forEach((x, i) => {
        comparisonHelper(x, objB[i])
      })
      if (objB.length > objA.length) changesCount += objB.length - objA.length
    } else {
      changesCount++
    }
  } else {
    objectKeys(objA).forEach(key => {
      comparisonHelper(objA[key], objB[key])
    })
    objectKeys(objB).forEach(key => {
      if (isUndefined(objA[key])) changesCount++
    })
  }
  return changesCount
}
