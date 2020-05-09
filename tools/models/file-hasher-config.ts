
export interface FileHasherConfig {
  rootFolder: string,
  fileExtensions: string[],
  excludedFiles: string[],
  includedFiles: string[],
  excludedSubFolders: string[],
  includedSubFolders: string[],
}
