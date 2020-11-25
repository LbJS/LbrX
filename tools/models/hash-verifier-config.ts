
export interface HashVerifierConfig {
  rootFolder: string,
  indexHtml?: string,
  excludedFiles: string[],
  excludedSubFolders: string[],
  hashSets: {
    hashedFile: string,
    initiatorFile: string,
  }[],
  nonHashedFilesValidation: {
    throwError: boolean,
    extensionToCheck: string[],
  }
}
