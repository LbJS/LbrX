import { readJsonSync, writeJsonSync } from 'fs-extra'
import { performance } from 'perf_hooks'

global.beforeAll(() => {
  expect.extend({
    toFinishWithin: (method: () => void | Promise<void>, ms: number) => {
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
          arr.push({
            testName: jestState.currentTestName,
            testPath: jestState.testPath,
            time: timeDiff
          })
          writeJsonSync(performanceLogJsonPath, arr, { encoding: `utf8`, spaces: 2 })
        }
      }
      return {
        message: () => `expected the method ${pass ? `not ` : ``}to finish execution within ${ms}ms.`,
        pass,
      }
    }
  })
})
