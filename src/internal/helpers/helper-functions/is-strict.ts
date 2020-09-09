import { KeyValue } from '../../types'

export function isStrict(): boolean {
  try {
    const obj: KeyValue = {}
    Object.defineProperty(obj, 'x', { value: 0, writable: false })
    obj.x = 1
    return false
  } catch {
    return true
  }
}
