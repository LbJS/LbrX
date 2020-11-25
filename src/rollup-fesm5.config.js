import typescript from '@rollup/plugin-typescript'
import { getRollupBaseOptions } from './rollup-base.config'

const ROLLUP_OPTIONS = getRollupBaseOptions()

ROLLUP_OPTIONS.output.dir = './build/fesm5'
ROLLUP_OPTIONS.output.format = 'esm'
ROLLUP_OPTIONS.plugins.push(typescript({ tsconfig: './src/tsconfig.fesm5.json' }))

export default ROLLUP_OPTIONS
