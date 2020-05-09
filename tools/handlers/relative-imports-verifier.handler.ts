import { existsSync } from 'fs-extra'
import { dirname } from 'path'
import { getAllFilesFromDirectory, readStrFromFile, resolvePath } from '../extensions'
import { RelativeImportsVerifierConfig } from '../models'

export function testRelativeImports(config: RelativeImportsVerifierConfig): void {
  const rootPath = resolvePath(config.rootFolder)
  config.excludedFiles = config.excludedFiles.map(filePath => resolvePath(rootPath, filePath))
  const allFilesFromRootFolder = getAllFilesFromDirectory(rootPath)
  const filteredFiles = allFilesFromRootFolder.filter(file => {
    if (config.excludedFiles.includes(file)) return false
    return file.endsWith(config.fileExtension)
  })
  filteredFiles.forEach(file => {
    const fileStr = readStrFromFile(file)
    fileStr.split('\n').forEach((line, i) => {
      if (line.startsWith('import')
        || (line.startsWith('export *')
          && file.endsWith('index.ts'))
      ) {
        if (!testImport(line, file, config.fileExtension)) {
          throw new Error(`File: ${file} has a non relative import at line: ${i + 1} ${line}`)
        }
      }
    })
  })
}

function testImport(fileLine: string, filePath: string, extension: string): boolean {
  let importPath = fileLine.split("'")[1]
  if (!importPath) importPath = fileLine.split('"')[1]
  if (!importPath.startsWith('./') && !importPath.startsWith('../')) return false
  const currentDir = dirname(filePath)
  let relativeFile = resolvePath(currentDir, importPath)
  if (existsSync(relativeFile + extension)) return true
  relativeFile = resolvePath(relativeFile, 'index')
  return existsSync(relativeFile + extension)
}
