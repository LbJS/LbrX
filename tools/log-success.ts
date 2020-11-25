import { Provider } from './provider'

(() => {
  const logger = Provider.getLoggerHandler()
  const arg = process.argv[2]
  logger.logSuccess(arg)
})()
