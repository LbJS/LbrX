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
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Performance Test Report",
        // theme: "darkTheme",
        styleOverridePath: './dark-theme-test-report.css',
        outputPath: "./spec/performance-test-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
        sort: "status"
      }
    ]
  ]
})

module.exports = config
