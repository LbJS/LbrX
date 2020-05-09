import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { copySync, readJsonSync, writeJsonSync } from 'fs-extra'
import { base } from 'path-extra'
import { isString } from '../helpers'
import { resolvePath } from './path'

export function isDirEmpty(fullPath: string): boolean {
  return !readdirSync(fullPath).length
}

export function assertPathExist(fullPath: string): asserts fullPath {
  if (!existsSync(fullPath)) throw new Error(`Folder / file: "${fullPath}" do not exist."`)
}

export function readStrFromFile(filePath: string): string {
  const str = readFileSync(filePath, 'utf8')
  if (!isString(str)) throw new Error(`Can't read file: "${filePath}" as a string.`)
  return str
}

export function writeStrToFile(filePath: string, str: string): void {
  writeFileSync(filePath, str, 'utf8')
}

export function getAllFilesFromDirectory(rootFolder: string): string[] {
  rootFolder = resolvePath(rootFolder)
  let allFolders = [rootFolder]
  allFolders = allFolders.concat(getAllFoldersFromDirectory(rootFolder))
  let allFiles: string[] = []
  allFolders.forEach(folder => {
    const partialPaths = readdirSync(folder)
    const resolvedPaths = partialPaths.map(partialPath => resolvePath(folder, partialPath))
    allFiles = allFiles.concat(resolvedPaths.filter(resolvedPath => isFile(resolvedPath)))
  })
  return allFiles
}

export function getAllFoldersFromDirectory(rootFolder: string): string[] {
  const partialPaths = readdirSync(rootFolder)
  let dirs: string[] = []
  partialPaths.forEach(partialPAth => {
    const resolvedPath = resolvePath(rootFolder, partialPAth)
    if (isDirectory(resolvedPath)) {
      dirs.push(resolvedPath)
      dirs = dirs.concat(getAllFoldersFromDirectory(resolvedPath))
    }
  })
  return dirs
}

export function isFile(resolvedPath: string): boolean {
  return statSync(resolvedPath).isFile()
}

export function isDirectory(resolvedPath: string): boolean {
  return statSync(resolvedPath).isDirectory()
}

export function copyFilesList(filesList: string[], target: string): void {
  filesList.forEach(file => {
    const fileName = base(file, true)
    copySync(file, resolvePath(target, fileName))
  })
}

export function readJsonFromFile(filePath: string): { [key: string]: any } {
  return readJsonSync(filePath, { encoding: 'utf8' })
}

export function writeJsonToFile(filePath: string, obj: { [key: string]: any }): void {
  writeJsonSync(filePath, obj, { encoding: 'utf8', spaces: 2 })
}
