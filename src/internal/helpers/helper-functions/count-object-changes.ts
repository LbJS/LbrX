import { objectKeys } from '../shortened-functions'
import { isArray } from './is-array'
import { isDate } from './is-date'
import { isEmpty } from './is-empty'
import { isFunction } from './is-function'
import { isMoment } from './is-moment'
import { isObject } from './is-object'

export function countObjectChanges(objA: {}, objB: {}): number {
  if (isEmpty(objA) || isEmpty(objB)) return objA === objB ? 0 : 1
  if (isDate(objA)) return (isDate(objB) && objA.getTime() == objB.getTime()) ? 0 : 1
  if (isDate(objB)) return 1
  let changesCount = 0
  if (isArray(objA)) {
    if (isArray(objB)) {
      for (let i = 0; i < objA.length && i < objB.length; i++) {
        changesCount += countObjectChanges(objA[i], objB[i])
      }
      changesCount += Math.abs(objB.length - objA.length)
    } else {
      changesCount++
    }
  } else if (isArray(objB)) {
    changesCount++
  } else if (isObject(objA) && isObject(objB)) {
    if (isMoment(objA)) {
      return (isMoment(objB) && objA._d.getTime() == objB._d.getTime()) ? 0 : 1
    }
    if (isMoment(objB)) return 1
    const objBKeys = objectKeys(objB)
    let keyMatches = 0
    objectKeys(objA).forEach(key => {
      if (objBKeys.includes(key)) {
        changesCount += countObjectChanges(objA[key], objB[key])
        keyMatches++
      } else {
        changesCount++
      }
    })
    changesCount += objBKeys.length - keyMatches
  } else if (isFunction(objA) && isFunction(objB)) {
    return 0
  } else if (objA !== objB) {
    changesCount++
  }
  return changesCount
}
