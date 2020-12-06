const defaultConfig = require('./jest.config')

const PERFORMANCE_LOG_FILE_PATH = 'spec/performance-test-report.log.json'

const config = Object.assign(JSON.parse(JSON.stringify(defaultConfig)), {
  testRunner: 'jest-circus/runner',
  testRegex: [
    '/spec/.*\\.p-spec.ts$'
  ],
  setupFilesAfterEnv: [
    "<rootDir>/spec/__test__/setup/global-before-each.ts",
    "<rootDir>/spec/__test__/setup/global-after-each.ts",
    "<rootDir>/spec/__test__/setup/global-before-all.performance.ts",
  ],
  globalSetup: '<rootDir>/spec/__test__/setup/jest-performance.setup.ts',
  globals: {
    PERFORMANCE_LOG_FILE_PATH,
    'ts-jest': {
      tsconfig: './spec/tsconfig.json'
    }
  },
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Performance Test Report",
        performanceLogJson: PERFORMANCE_LOG_FILE_PATH,
        styleOverridePath: './dark-theme-test-report.css',
        customScriptPath: './performance-test-report.js',
        outputPath: "./spec/performance-test-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
        sort: "status"
      }
    ]
  ],
})

module.exports = config
