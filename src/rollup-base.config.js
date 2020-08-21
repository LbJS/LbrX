import multi from '@rollup/plugin-multi-entry'
import fs from 'fs'
import path from 'path'

/**
 * @returns {import('rollup').RollupOptions}
 */
export function getRollupBaseOptions() {
  return {
    input: [
      'src/index.ts',
      'src/core/index.ts',
      'src/dev-tools/index.ts',
      'src/utils/index.ts'
    ],
    output: {
      sourcemap: true,
      sourcemapPathTransform: (str) => str.substring(3),
    },
    external: [
      'rxjs',
      'rxjs/operators'
    ],
    plugins: [
      multi({ entryFileName: 'index.js' }),
      {
        name: 'rollup-plugin-min-js-empty-line-top',
        writeBundle: options => {
          const fileName = options.file
          if (!fileName || !fileName.endsWith('min.js')) return
          const filePath = path.resolve(__dirname, '../', fileName)
          let fileStr = fs.readFileSync(filePath, { encoding: 'utf-8' })
          fileStr = '\n' + fileStr
          fs.writeFileSync(filePath, fileStr, { encoding: 'utf-8' })
        }
      },
    ]
  }
}

/**
 * @returns {string}
 */
export function licenseBannerGenerator() {
  const licenseFilePath = path.resolve(__dirname, '../LICENSE')
  const licenseStr = fs.readFileSync(licenseFilePath, { encoding: 'utf-8' })
  const licenseArr = licenseStr.split('\n')
  let banner = '\n/*!\n'
  licenseArr.forEach((line, i) => {
    if (line.length == 1) line = line.trim()
    if (!(!line && licenseArr.length - 1 == i)) banner += ` *${line ? ' ' + line : ''}\n`
  })
  banner += ' */'
  return banner
}
