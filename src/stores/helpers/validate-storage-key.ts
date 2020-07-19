import { logError, throwError } from '../../helpers'
import { isDev } from '../../mode'

const storageKeys: string[] = []

export function validateStorageKey(storageKey: string, storeName: string): void {
  if (storageKeys.includes(storageKey)) {
    const errorMsg = `This storage key is not unique: "${storageKey}" from store: "${storeName}"!`
    isDev() ? throwError(errorMsg) : logError(errorMsg)
  } else {
    storageKeys.push(storageKey)
  }
}
