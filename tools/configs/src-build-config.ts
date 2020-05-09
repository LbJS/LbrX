import { SrcBuildConfig } from '../models'
import { LOGGER_CONFIG } from './logger-config'

const rootFolder = './'
const buildFolder = 'build'

const createTscCommand = (moduleName: string) => `tsc -p src/tsconfig.${moduleName}.json`
const createRollupCommand = (moduleName: string) => `rollup -c ./src/rollup-${moduleName}.config.js`
const createStartInfoLog = (moduleName: string) => `SRC ${moduleName} build started.`
const createEndInfoLog = (moduleName: string) => `SRC ${moduleName} build was finished.`

export const SRC_BUILD_CONFIG: SrcBuildConfig = {
  logger: LOGGER_CONFIG,
  rootFolder,
  buildFolder,
  buildSets: [
    {
      command: createTscCommand('es5'),
      startInfoLog: createStartInfoLog('es5'),
      endInfoLog: createEndInfoLog('es5'),
    },
    {
      command: createTscCommand('es2015'),
      startInfoLog: createStartInfoLog('es2015'),
      endInfoLog: createEndInfoLog('es2015'),
    },
    {
      command: createTscCommand('es2018'),
      startInfoLog: createStartInfoLog('es2018'),
      endInfoLog: createEndInfoLog('es2018'),
    },
    {
      command: createTscCommand('esm5'),
      startInfoLog: createStartInfoLog('esm5'),
      endInfoLog: createEndInfoLog('esm5'),
    },
    {
      command: createTscCommand('esm2015'),
      startInfoLog: createStartInfoLog('esm2015'),
      endInfoLog: createEndInfoLog('esm2015'),
    },
    {
      command: createTscCommand('esm2018'),
      startInfoLog: createStartInfoLog('esm2018'),
      endInfoLog: createEndInfoLog('esm2018'),
    },
    {
      command: createTscCommand('types'),
      startInfoLog: createStartInfoLog('types'),
      endInfoLog: createEndInfoLog('types'),
    },
    {
      command: createRollupCommand('fesm2015'),
      startInfoLog: createStartInfoLog('fesm2015'),
      endInfoLog: createEndInfoLog('fesm2015'),
    },
    {
      command: createRollupCommand('fesm5'),
      startInfoLog: createStartInfoLog('fesm5'),
      endInfoLog: createEndInfoLog('fesm5'),
    },
    {
      command: createRollupCommand('umd5'),
      startInfoLog: createStartInfoLog('umd5'),
      endInfoLog: createEndInfoLog('umd5'),
    },
    {
      command: createRollupCommand('umd5min'),
      startInfoLog: createStartInfoLog('umd5min'),
      endInfoLog: createEndInfoLog('umd5min'),
    },
    {
      command: createRollupCommand('umd2015'),
      startInfoLog: createStartInfoLog('umd2015'),
      endInfoLog: createEndInfoLog('umd2015'),
    },
    {
      command: createRollupCommand('umd2015min'),
      startInfoLog: createStartInfoLog('umd2015min'),
      endInfoLog: createEndInfoLog('umd2015min'),
    },
  ],
  relativeImportsVerifier: {
    rootFolder: 'src',
    excludedFiles: [],
    fileExtension: '.ts'
  }
}
