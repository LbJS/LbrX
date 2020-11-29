import { basename, dirname } from 'path'
import { getAllFilesFromDirectory, readStrFromFile, resolvePath } from '../extensions'
import { RollupInputsVerifierConfig } from '../models'

export function verifyRollupInputs(config: RollupInputsVerifierConfig): void {
  const moduleFiles: string[] = getAllModuleFiles(config)
  assertModules(config.rollupInputs, moduleFiles, config.rootFolder)
}

function getAllModuleFiles(config: RollupInputsVerifierConfig): string[] {
  const rootPath: string = resolvePath(config.rootFolder)
  const excludedFolders: string[] = config.excludedFolders.map(x => resolvePath(rootPath, x))
  const allFiles: string[] = getAllFilesFromDirectory(rootPath)
  const filteredModules: string[] = allFiles.filter(file => {
    if (dirname(file).split(`\\`).length > rootPath.split(`\\`).length + config.scanLevel) return false
    if (config.includedFileExtensions.length && config.includedFileExtensions.every(x => !file.endsWith(x))) return false
    if (excludedFolders.some(x => dirname(file).startsWith(x))) return false
    if (config.excludedFilePatterns.some(x => RegExp(x).test(basename(file)))) return false
    const isModule = readStrFromFile(file).split(`\n`).some(line => line.startsWith(`export *`) || line.startsWith(`export {`))
    return isModule
  })
  return filteredModules
}

function assertModules(rollupInputs: string[], moduleFiles: string[], rootFolder: string): void {
  const rollupInputPaths: string[] = rollupInputs.map(x => x.startsWith(rootFolder) ? resolvePath(x) : resolvePath(rootFolder, x))
  moduleFiles.forEach(file => {
    if (!rollupInputPaths.some(x => x === file)) {
      throw new Error(`File: ${file} is no included in rollup input.`)
    }
  })
  rollupInputPaths.forEach((inputPath, index) => {
    if (!moduleFiles.some(x => x === inputPath)) {
      throw new Error(`Rollup input: ${rollupInputs[index]} was not found in source folder, or it might be filtered out by the algorithm.`)
    }
  })
}
