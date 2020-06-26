import { removeSync } from 'fs-extra'
import { resolvePath } from '../extensions'
import { runCommand, testRelativeImports } from '../handlers'
import { Provider } from '../provider'

export default async function main(): Promise<void> {
  const config = Provider.getSrcBuildConfigHandler().config
  const logger = Provider.getLoggerHandler()
  logger.config = config.logger
  removeSync(resolvePath(config.buildFolder))
  testRelativeImports(config.relativeImportsVerifier)
  logger.logSuccess('Relative path verification')
  await Promise.all(config.buildSets.map(async set => {
    return runCommand(set.command, set.startInfoLog).then(() => logger.logInfo(set.endInfoLog))
  }))
  logger.logSuccess('SRC build')
}
