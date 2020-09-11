import { isArray, isEntity, isUndefined, objectKeys } from '__test__/functions'

export function splitToObject(obj: {}): {}[] {
  const arr: {}[] = []
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue
    if (isArray(obj[key])) {
      obj[key].forEach((val: any, i: number) => {
        if (!isUndefined(val)) {
          if (!arr[i]) arr[i] = {}
          arr[i][key] = val
        }
      })
    } else if (isEntity(obj[key])) {
      const innerObjects = splitToObject(obj[key])
      for (let i = 0; i < innerObjects.length; i++) {
        if (!isUndefined(innerObjects[i]) &&
          !objectKeys(innerObjects[i]).length
        ) {
          innerObjects[i] = undefined as any
        }
        if (isUndefined(innerObjects[i]) &&
          isUndefined(arr[i]) ||
          (isEntity(arr[i]) &&
            !objectKeys(arr[i]).length)
        ) {
          arr[i] = undefined as any
        } else if (!arr[i]) {
          arr[i] = {}
          arr[i][key] = innerObjects[i]
        } else if (!isUndefined(innerObjects[i])) {
          arr[i][key] = innerObjects[i]
        }
      }
    }
  }
  return arr
}
