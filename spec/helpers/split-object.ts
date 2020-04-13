import { isArray } from './is-array'

export function splitObject(obj: {}): {}[] {
  const arr: {}[] = []
  for (const key in obj) {
    if (!obj.hasOwnProperty(key) || !isArray(obj[key])) continue
    obj[key].forEach(() => {
      arr.push({})
    })
    break
  }
  for (const key in obj) {
    if (!obj.hasOwnProperty(key) || !isArray(obj[key])) continue
    obj[key].forEach((val: any, i: number) => {
      arr[i][key] = val
    })
  }
  return arr
}
