import { LoggerConfig } from './logger-config'
import { RelativeImportsVerifierConfig } from './relative-imports-verifier-config'

export interface SrcBuildConfig {
  logger: LoggerConfig,
  rootFolder: string,
  buildFolder: string,
  buildSets: {
    command: string,
    startInfoLog: string,
    endInfoLog: string,
  }[],
  relativeImportsVerifier: RelativeImportsVerifierConfig
}
