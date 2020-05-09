import { addBanners, copyFiles, handlePkgJsonFile, handleVersionIncrement } from '../handlers'
import { Provider } from '../provider'

export default async function main(): Promise<void> {
  const config = Provider.getPostSrcBuildConfigHandler().config
  const logger = Provider.getLoggerHandler()
  logger.config = config.logger
  await handleVersionIncrement(config)
  copyFiles(config.filesToCopy)
  // root package.json
  handlePkgJsonFile(config.rootFolder, config.packageJsonPath, config.rootPackageJsonConfig)
  // build package.json
  handlePkgJsonFile(config.rootFolder, config.packageJsonPath, config.buildPackageJsonConfig, config.buildFolder)
  // root package-lock.json
  handlePkgJsonFile(config.rootFolder, config.packageLockJsonPath, config.packageLockJsonConfig)
  addBanners(config.bannerAdder)
  logger.logSuccess('Post SRC build')
}
