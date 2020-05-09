import typescript from '@rollup/plugin-typescript'
import { terser } from "rollup-plugin-terser"
import { getRollupBaseOptions } from './rollup-base.config'

const ROLLUP_OPTIONS = getRollupBaseOptions()

ROLLUP_OPTIONS.output.format = 'umd'
ROLLUP_OPTIONS.output.file = './build/bundles/lbdate.umd.min.js'
ROLLUP_OPTIONS.output.name = '__lbdateModule'
ROLLUP_OPTIONS.output.footer = 'typeof window == \'object\' && (window.lbDate = window.__lbdateModule.lbDate);'
ROLLUP_OPTIONS.output.sourcemap = false
ROLLUP_OPTIONS.plugins.push(typescript({ tsconfig: './src/tsconfig.umd2015.json' }))
ROLLUP_OPTIONS.plugins.push(terser())

export default ROLLUP_OPTIONS
