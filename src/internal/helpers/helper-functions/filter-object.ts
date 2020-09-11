import { KeyOf } from '../../types'
import { objectKeys } from '../shortened-functions'
import { cloneObject } from './clone-object'

export function filterObject<T extends R, R extends object>(obj: T, keys: KeyOf<R>[], isRemoveKeys: boolean = true): R {
  if (!obj) return obj
  const copy = cloneObject(obj)
  objectKeys(copy).forEach(key => {
    if (keys.includes(key as KeyOf<R>) && isRemoveKeys) delete copy[key]
    else if (!keys.includes(key as KeyOf<R>) && !isRemoveKeys) delete copy[key]
  })
  return copy
}
