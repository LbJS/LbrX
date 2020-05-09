import typescript from '@rollup/plugin-typescript'
import { getRollupBaseOptions } from './rollup-base.config'

const ROLLUP_OPTIONS = getRollupBaseOptions()

ROLLUP_OPTIONS.output.format = 'umd'
ROLLUP_OPTIONS.output.file = './build/bundles/lbdate.umd.es5.js'
ROLLUP_OPTIONS.output.name = '__lbdateModule'
ROLLUP_OPTIONS.output.footer = 'typeof window == \'object\' && (window.lbDate = window.__lbdateModule.lbDate);'
ROLLUP_OPTIONS.plugins.push(typescript({ tsconfig: './src/tsconfig.umd5.json' }))

export default ROLLUP_OPTIONS
