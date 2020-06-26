import { readStrFromFile, resolvePath, writeStrToFile } from '../extensions'
import { FileStringReplacementConfig, StringReplacementSet } from '../models'
import { Provider } from '../provider'

export async function replaceStringsInFile(config: FileStringReplacementConfig): Promise<void> {
  await Promise.all(config.sets.map(async dataSet => {
    const filePath = resolvePath(config.rootFolder, dataSet.filePath)
    let fileStr = readStrFromFile(filePath)
    if (!fileStr) throw new Error(`This file is empty: ${filePath}`)
    dataSet.replacementSets = await prepareReplacementSets(dataSet.replacementSets)
    fileStr = replaceStrings(
      dataSet.replacementSets,
      fileStr,
      filePath,
    )
    writeStrToFile(filePath, fileStr)
  }))
}

async function prepareReplacementSets(replacementSets: StringReplacementSet[]): Promise<StringReplacementSet[]> {
  const hash = Provider.getHashHandler().hash
  const appDetails = Provider.getAppDetailsHandler()
  const curAppVer = await appDetails.getCurrAppVer()
  const nextAppVer = appDetails.nextAppVer
  const replacePlaceHolders = (str: string): string => {
    return str.replace(/\[hash\]/g, hash)
      .replace(/\[curAppVer\]/g, curAppVer)
      .replace(/\[nextAppVer\]/g, nextAppVer)
  }
  return replacementSets.map(set => ({
    currStr: replacePlaceHolders(set.currStr),
    nextStr: replacePlaceHolders(set.nextStr),
  }))
}

function replaceStrings(
  replacementSets: StringReplacementSet[],
  fileStr: string,
  filePath: string,
): string {
  replacementSets.forEach(set => {
    if (!fileStr.includes(set.currStr)) {
      throw new Error(`Cannot replace ${set.currStr} because it wasn't found in this file: ${filePath}.`)
    }
    if (set.currStr !== set.nextStr) {
      do {
        fileStr = fileStr.replace(set.currStr, set.nextStr)
      } while (fileStr.includes(set.currStr))
    }
  })
  return fileStr
}
