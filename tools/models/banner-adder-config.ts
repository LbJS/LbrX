
export interface BannerAdderConfig {
  rootFolder: string,
  isSeparateRow: boolean,
  bannerSets: {
    fileType: string,
    banner: string
  }[],
  excludedFiles: string[],
  excludedSubFolders: string[],
  includedSubFolders: string[],
}
