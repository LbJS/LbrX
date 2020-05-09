import { dirname } from 'path'
import { getAllFilesFromDirectory, readStrFromFile, resolvePath, resolvePathsList, writeStrToFile } from '../extensions'
import { BannerAdderConfig } from '../models'
import { Provider } from '../provider'
import { hashFileName } from './hash-file-names.handler'

export function addBanners(config: BannerAdderConfig): void {
  config = resolveConfigPaths(config)
  const hash = Provider.getHashHandler().hash
  const filteredFiles = getAllFilesFromDirectory(config.rootFolder).filter(file => {
    if (config!.excludedFiles.some(x => file === x
      || file === hashFileName(x, hash))
    ) {
      return false
    }
    if (config!.excludedSubFolders.some(x => dirname(file).includes(x)
      && config!.includedSubFolders.every(y => !dirname(file).includes(y))
      || (config!.includedSubFolders.some(y => dirname(file).includes(y)
        && x.length >= y.length)))
    ) {
      return false
    }
    return true
  })
  filteredFiles.forEach(file => {
    const bannerSet = config!.bannerSets.find(x => file.endsWith(x.fileType))
    if (bannerSet) {
      if (bannerSet.banner.includes('[appVer]')) {
        const appVer = Provider.getAppDetailsHandler().appVer
        bannerSet.banner = bannerSet.banner.replace('[appVer]', appVer)
      }
      let fileStr = readStrFromFile(file)
      fileStr = `${bannerSet.banner}${config!.isSeparateRow ? '\n' : ''}${fileStr}`
      writeStrToFile(file, fileStr)
    }
  })
}

function resolveConfigPaths(config: BannerAdderConfig): BannerAdderConfig {
  config.rootFolder = resolvePath(config.rootFolder)
  config.excludedFiles = resolvePathsList(config.excludedFiles, config.rootFolder)
  config.excludedSubFolders = resolvePathsList(config.excludedSubFolders, config.rootFolder)
  config.includedSubFolders = resolvePathsList(config.includedSubFolders, config.rootFolder)
  return config
}
