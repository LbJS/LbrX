const defaultConfig = require('./jest.config')

const config = Object.assign(JSON.parse(JSON.stringify(defaultConfig)), {
  testRunner: 'jest-circus/runner',
  testRegex: [
    '/spec/.*\\.p-spec.ts$'
  ],
  setupFilesAfterEnv: [
    "<rootDir>/spec/__test__/setup/global-before-each.ts",
    "<rootDir>/spec/__test__/setup/global-after-each.ts",
  ],
})

module.exports = config
