import { isDev } from 'lbrx/mode'
import { throwError, logError } from 'lbrx/helpers'

const storeNames: string[] = []

export function validateStoreName(storeName: string): void {
  if (storeNames.includes(storeName)) {
    const errorMsg = `There are multiple stores with the same store name: "${storeName}"!`
    isDev() ? throwError(errorMsg) : logError(errorMsg)
  } else {
    storeNames.push(storeName)
  }
}

const storageKeys: string[] = []

export function validateStorageKey(storageKey: string, storeName: string): void {
  if (storageKeys.includes(storageKey)) {
    const errorMsg = `This storage key is no unique: "${storageKey}" from store: "${storeName}"!`
    isDev() ? throwError(errorMsg) : logError(errorMsg)
  } else {
    storageKeys.push(storageKey)
  }
}
