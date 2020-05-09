import { BannerAdderConfig } from './banner-adder-config'
import { FileCopyConfig } from './files-copy-config'
import { LoggerConfig } from './logger-config'
import { PackageJsonConfig } from './package-json-config'

export interface PostSrcBuildConfig {
  logger: LoggerConfig,
  rootFolder: string,
  buildFolder: string,
  packageJsonPath: string,
  packageLockJsonPath: string,
  filesToCopy: FileCopyConfig | FileCopyConfig[],
  npmGetVerCommand: string,
  buildPackageJsonConfig: PackageJsonConfig,
  rootPackageJsonConfig: PackageJsonConfig,
  packageLockJsonConfig: PackageJsonConfig,
  bannerAdder: BannerAdderConfig,
}
