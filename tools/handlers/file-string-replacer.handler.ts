import { readStrFromFile, resolvePath, writeStrToFile } from '../extensions'
import { FileStringReplacementConfig, StringReplacementSet } from '../models'
import { Provider } from '../provider'

export function replaceStringsInFile(config: FileStringReplacementConfig): void {
  const hash = Provider.getHashHandler().hash
  config.sets.forEach(dataSet => {
    const filePath = resolvePath(config.rootFolder, dataSet.filePath)
    let fileStr = readStrFromFile(filePath)
    if (!fileStr) throw new Error(`This file is empty: ${filePath}`)
    fileStr = replaceStrings(
      dataSet.replacementSets,
      hash,
      fileStr,
      filePath,
    )
    writeStrToFile(filePath, fileStr)
  })
}

function replaceStrings(
  replacementSets: StringReplacementSet[],
  hash: string,
  fileStr: string,
  filePath: string,
): string {
  replacementSets.forEach(set => {
    if (!fileStr.includes(set.currStr)) {
      throw new Error(`Cannot replace ${set.currStr} because it wasn't found in this file: ${filePath}.`)
    }
    if (set.nextStr.includes('[hash]')) {
      set.nextStr = set.nextStr.replace('[hash]', hash)
    }
    fileStr = fileStr.replace(set.currStr, set.nextStr)
  })
  return fileStr
}
