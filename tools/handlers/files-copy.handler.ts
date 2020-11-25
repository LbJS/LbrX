import { copySync } from 'fs-extra'
import { base } from 'path-extra'
import { copyFilesList, isDirectory, isFile, resolvePath, resolvePathsList } from '../extensions'
import { FileCopyConfig } from '../models/files-copy-config'

export function copyFiles(config: FileCopyConfig | FileCopyConfig[]): void {
  if (Array.isArray(config)) {
    config.forEach(x => _copyFiles(x))
  } else {
    _copyFiles(config)
  }
}

function _copyFiles(config: FileCopyConfig): void {
  if (!config.files && !config.sourceFolder) {
    throw new Error("Can't initiate Files Copy Handler without files list or source folder.")
  }
  const targetFolder = resolvePath(config.rootFolder, config.targetFolder)
  if (config.files) {
    const files = resolvePathsList(config.files, config.rootFolder)
    copyFilesList(files, targetFolder)
  }
  if (!config.sourceFolder) return
  const sourceFolderConfig = config.sourceFolder
  const rootFolder = config.rootFolder
  const sourceFolderFilter = (src: string): boolean => {
    const path = resolvePath(config.rootFolder, src)
    if (isFile(path)) {
      if (sourceFolderConfig.excludedFiles
        && sourceFolderConfig.excludedFiles.some(x => path == resolvePath(rootFolder, sourceFolderConfig.name, x))) {
        return false
      }
      if (sourceFolderConfig.includedFiles
        && sourceFolderConfig.includedFiles.some(x => path == resolvePath(rootFolder, sourceFolderConfig.name, x))) {
        return true
      }
      const baseFileName = base(path, /*include ext*/ true)
      if (sourceFolderConfig.excludedFileNamesByPattern) {
        const patternParts = sourceFolderConfig.excludedFileNamesByPattern.split('.')
        const fileParts = baseFileName.split('.')
        let isMatch = false
        if (patternParts.length == 2
          && ((patternParts[0] == '**'
            && baseFileName.endsWith('.' + patternParts[1]))
            || (patternParts[1] == '**'
              && baseFileName.startsWith('.' + patternParts[0])))
        ) {
          isMatch = true
        } else {
          isMatch = fileParts.every((part, i) => patternParts[i] === part || patternParts[i] === '*')
        }
        if (isMatch) return false
      }
      if (sourceFolderConfig.excludeFilesThatStartsWith
        && baseFileName.startsWith(sourceFolderConfig.excludeFilesThatStartsWith)) {
        return false
      }
    }
    if (sourceFolderConfig.excludedSubFolder
      && isDirectory(path)
      && sourceFolderConfig.excludedSubFolder.some(x =>
        path.startsWith(resolvePath(rootFolder, sourceFolderConfig.name, x))
        && (!sourceFolderConfig.includedSubFolder
          || !sourceFolderConfig.includedSubFolder.every(y =>
            path.startsWith(resolvePath(rootFolder, sourceFolderConfig.name, y))
            && x.length > y.length)))
    ) {
      return false
    }
    return true
  }
  copySync(sourceFolderConfig.name, targetFolder, { filter: sourceFolderFilter })
}
