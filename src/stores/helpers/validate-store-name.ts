import { logError, throwError } from '../../helpers'
import { isDev } from '../../mode'

const storeNames: string[] = []

export function validateStoreName(storeName: string): void {
  if (storeNames.includes(storeName)) {
    const errorMsg = `There are multiple stores with the same store name: "${storeName}"!`
    isDev() ? throwError(errorMsg) : logError(errorMsg)
  } else {
    storeNames.push(storeName)
  }
}
