import typescript from '@rollup/plugin-typescript'
import { getRollupBaseOptions } from './rollup-base.config'

const ROLLUP_OPTIONS = getRollupBaseOptions()

ROLLUP_OPTIONS.output.dir = './build/fesm2015'
ROLLUP_OPTIONS.output.format = 'esm'
ROLLUP_OPTIONS.plugins.push(typescript({ tsconfig: './src/tsconfig.fesm2015.json' }))

export default ROLLUP_OPTIONS
