import { BannerAdderConfig } from './banner-adder-config'
import { FileHasherConfig } from './file-hasher-config'
import { FileStringReplacementConfig } from './file-string-replacement-config'
import { HashVerifierConfig } from './hash-verifier-config'
import { LoggerConfig } from './logger-config'

export interface PostPgBuildConfig {
  logger: LoggerConfig,
  hashLength: number,
  hashCharPool: string,
  minifyHtmlCommand: string,
  fileStringReplacement: FileStringReplacementConfig,
  fileHasher: FileHasherConfig,
  hashVerifier: HashVerifierConfig,
  bannerAdder: BannerAdderConfig
}
