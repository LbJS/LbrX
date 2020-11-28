import { LoggerConfig } from './logger-config'
import { RelativeImportsVerifierConfig } from './relative-imports-verifier-config'
import { RollupInputsVerifierConfig } from './rollup-inputs-verifier-config'

export interface SrcBuildConfig {
  logger: LoggerConfig,
  rootFolder: string,
  buildFolder: string,
  buildSets: {
    command: string,
    startInfoLog: string,
    endInfoLog: string,
  }[],
  relativeImportsVerifier: RelativeImportsVerifierConfig,
  rollupInputsVerifierConfig: RollupInputsVerifierConfig,
}
