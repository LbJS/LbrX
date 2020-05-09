import typescript from '@rollup/plugin-typescript'
import { terser } from "rollup-plugin-terser"
import { getRollupBaseOptions } from './rollup-base.config'

const ROLLUP_OPTIONS = getRollupBaseOptions()

ROLLUP_OPTIONS.output.format = 'umd'
ROLLUP_OPTIONS.output.file = './build/bundles/lbdate.umd.es5.min.js'
ROLLUP_OPTIONS.output.name = 'lbrx'
ROLLUP_OPTIONS.output.sourcemap = false
ROLLUP_OPTIONS.plugins.push(typescript({ tsconfig: './src/tsconfig.umd5.json' }))
ROLLUP_OPTIONS.plugins.push(terser())
ROLLUP_OPTIONS.output.globals = {
  "rxjs": "rxjs",
  "rxjs/operators": "rxjs.operators"
}

export default ROLLUP_OPTIONS
