import { readJsonSync, writeJsonSync } from 'fs-extra'
import { performance } from 'perf_hooks'

export const toFinishWithin = (method: () => void | Promise<void>, ms: number) => {
  const startTime = performance.now()
  method()
  const endTime = performance.now()
  const timeDiff = Math.floor(endTime - startTime)
  const pass = timeDiff <= ms
  const performanceLogJsonPath: string = globalThis.PERFORMANCE_LOG_FILE_PATH
  if (performanceLogJsonPath) {
    const arr: any[] | void = readJsonSync(performanceLogJsonPath, { encoding: `utf8` })
    if (Array.isArray(arr)) {
      const jestState = expect.getState()
      const currItem = arr.find(x => x.testName === jestState.currentTestName && x.testPath === jestState.testPath)
      if (currItem) {
        currItem.time = timeDiff
      } else {
        arr.push({
          testName: jestState.currentTestName,
          testPath: jestState.testPath,
          time: timeDiff
        })
      }
      writeJsonSync(performanceLogJsonPath, arr, { encoding: `utf8`, spaces: 2 })
    }
  }
  return {
    message: () => `expected the method ${pass ? `not ` : ``}to finish execution within ${ms}ms.`,
    pass,
  }
}
