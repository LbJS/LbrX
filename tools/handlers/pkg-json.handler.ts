import { pathExistsSync } from 'fs-extra'
import { base } from 'path-extra'
import { readJsonFromFile, resolvePath, writeJsonToFile } from '../extensions'
import { PackageJsonConfig } from '../models'
import { Provider } from '../provider'

export function handlePkgJsonFile(
  rootFolder: string,
  sourceFile: string,
  config: PackageJsonConfig,
  targetFolder?: string
): void {
  const appDetails = Provider.getAppDetailsHandler()
  const sourcePath = resolvePath(rootFolder, sourceFile)
  const obj = readJsonFromFile(sourcePath)
  let tempObj = obj
  config.propertiesToDelete.forEach(prop => {
    prop.split('.').forEach((key, i) => {
      if (prop.split('.').length - 1 == i) {
        delete tempObj[key]
      } else {
        tempObj = tempObj[key]
      }
    })
  })
  config.propertiesToAddOrUpdate.forEach(set => {
    if (set.value.includes('[appVer]')) set.value = set.value.replace('[appVer]', appDetails.appVer)
    if (set.value.includes('[appName]')) set.value = set.value.replace('[appName]', appDetails.appName)
    tempObj = obj
    set.key.split('.').forEach((key, i) => {
      if (set.key.split('.').length - 1 == i
        && tempObj[key] !== set.value
      ) {
        tempObj[key] = set.value
      } else {
        tempObj = tempObj[key]
      }
    })
  })
  let targetPath = sourcePath
  if (targetFolder) targetPath = resolvePath(rootFolder, targetFolder, base(sourcePath, true))
  if (pathExistsSync(targetPath) && JSON.stringify(obj) === JSON.stringify(readJsonFromFile(targetPath))) return
  writeJsonToFile(targetPath, obj)
}
