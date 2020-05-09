import { isPromise } from './helpers/is-promise'
import { Provider } from './provider'

(async () => {
  const logger = Provider.getLoggerHandler()
  try {
    const arg = process.argv[2].substr(2)
    const result = (await import('./scripts/' + arg)).default() as unknown
    if (isPromise(result)) await result
  } catch (e) {
    logger.logError(e)
    process.exit(1)
  }
  process.exit(0)
})()
