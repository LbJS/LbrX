import { writeJsonSync } from 'fs-extra'
import { resolve } from 'path'

export default async (globalConfig: Record<string, any>) => {
  if (Array.isArray(globalConfig.reporters)
    && Array.isArray(globalConfig.reporters[1])
    && globalConfig.reporters[1][1]
    && globalConfig.reporters[1][1].performanceLogJson
  ) {
    const performanceLogJsonPath = resolve(globalConfig.reporters[1][1].performanceLogJson)
    writeJsonSync(performanceLogJsonPath, [], { encoding: `utf8`, spaces: 2 })
  }
}
