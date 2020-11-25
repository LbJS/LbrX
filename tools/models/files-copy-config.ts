
export interface FileCopyConfig {
  rootFolder: string,
  files?: string[],
  targetFolder: string,
  sourceFolder?: {
    name: string
    excludedFiles?: string[],
    includedFiles?: string[],
    excludedSubFolder?: string[],
    includedSubFolder?: string[],
    excludedFileNamesByPattern?: string,
    excludeFilesThatStartsWith?: string,
  }
}
