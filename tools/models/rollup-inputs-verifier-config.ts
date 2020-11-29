
export interface RollupInputsVerifierConfig {
  rootFolder: string,
  scanLevel: number,
  includedFileExtensions: string[],
  excludedFolders: string[],
  excludedFilePatterns: string[],
  rollupInputs: string[],
}
