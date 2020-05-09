import { pathExistsSync } from 'fs-extra'
import { getAllFilesFromDirectory, readStrFromFile, resolvePath, resolvePathsList } from '../extensions'
import { HashVerifierConfig } from '../models'
import { Provider } from '../provider'
import { hashFileName } from './hash-file-names.handler'

export function verifyHashes(config: HashVerifierConfig): void {
  config = resolveConfigPaths(config)
  const hash = Provider.getHashHandler().hash
  validatePathsExist(config, hash)
  config.hashSets.forEach(set => {
    if (pathExistsSync(set.hashedFile)) throw new Error(`File: "${set.hashedFile}" is not hashed.`)
    const fileStr = readStrFromFile(set.initiatorFile)
    const hashedFile = hashFileName(set.hashedFile, hash)
      .split(config.rootFolder)[1]
      .substring(1)
      .replace(/\\/g, '/')
    if (!fileStr.includes(hashedFile)) throw new Error(`Initiator file: "${set.initiatorFile}" does not include "${hashedFile}".`)
  })
  if (!config.indexHtml) return
  const filteredFiles = getAllFilesFromDirectory(config.rootFolder).filter(x => {
    if (x.includes(hash)
      && (x.endsWith('.js')
        || x.endsWith('.css'))
      && !config.excludedFiles.some(y => y === x
        || (!y.includes(hash)
          && hashFileName(y, hash) === x))
      && !config.excludedSubFolders.some(y => x.includes(y))
    ) {
      return true
    }
    return false
  })
  for (const file of filteredFiles) {
    if (!file.includes(hash)) continue
    const rawHtmlFile = readStrFromFile(config.indexHtml)
    const hashedFile = file.split(config.rootFolder)[1]
      .substring(1)
      .replace(/\\/g, '/')
    if (!rawHtmlFile.includes(hashedFile)) throw new Error(`Html file: "${config.indexHtml}" doesn't include "${hashedFile}"`)
  }
}

function resolveConfigPaths(config: HashVerifierConfig): HashVerifierConfig {
  config.rootFolder = resolvePath(config.rootFolder)
  if (config.indexHtml) config.indexHtml = resolvePath(config.rootFolder, config.indexHtml)
  config.excludedFiles = resolvePathsList(config.excludedFiles, config.rootFolder)
  config.excludedSubFolders = resolvePathsList(config.excludedSubFolders, config.rootFolder)
  config.hashSets = config.hashSets.map(set => ({
    hashedFile: resolvePath(config.rootFolder, set.hashedFile),
    initiatorFile: resolvePath(config.rootFolder, set.initiatorFile),
  }))
  return config
}

function validatePathsExist(config: HashVerifierConfig, hash: string): void {
  const allFolderPaths = [
    config.rootFolder,
    config.excludedSubFolders,
  ].flat()
  allFolderPaths.forEach(folderPath => {
    if (!pathExistsSync(folderPath)) throw new Error(`Folder: "${folderPath}" doesn't exist.`)
  })
  const allFilePaths = [
    config.indexHtml,
    config.excludedFiles,
    config.hashSets.map(set => Object.values(set)),
  ].flat(Infinity)
  allFilePaths.forEach(filePath => {
    if (!pathExistsSync(filePath)
      && !pathExistsSync(hashFileName(filePath, hash))
    ) {
      throw new Error(`File: "${filePath}" doesn't exist.`)
    }
  })
  if (!config.nonHashedFilesValidation.throwError) return
  const allFiles = getAllFilesFromDirectory(config.rootFolder)
  allFiles.forEach(file => {
    if ((config.nonHashedFilesValidation.extensionToCheck.length
      && config.nonHashedFilesValidation.extensionToCheck.some(x => file.endsWith(x))
      && !file.includes(hash))
      || (!config.nonHashedFilesValidation.extensionToCheck.length
        && !file.includes(hash))
    ) {
      throw new Error(`File: "${file}" isn't hashed.`)
    }
  })
}
