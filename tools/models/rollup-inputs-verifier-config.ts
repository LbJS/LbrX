
export interface RollupInputsVerifierConfig {
  rootFolder: string,
  includedFileExtensions: string[],
  excludedFolders: string[],
  excludedFilePatterns: RegExp[],
  rollupInputs: string[],
}
