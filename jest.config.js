module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: './spec/tsconfig.json'
    }
  },
  moduleNameMapper: {
    "^lbrx$": "<rootDir>/src",
    "^lbrx/helpers$": "<rootDir>/src/helpers",
    "^lbrx/mode$": "<rootDir>/src/mode",
    "^lbrx/hooks$": "<rootDir>/src/hooks",
    "^lbrx/types$": "<rootDir>/src/types",
    "^lbrx/dev-tools$": "<rootDir>/src/dev-tools",
    "^lbrx/stores/config$": "<rootDir>/src/stores/config",
    "^helpers$": "<rootDir>/spec/helpers",
    "^helpers/factories$": "<rootDir>/spec/helpers/factories",
    "^helpers/functions$": "<rootDir>/spec/helpers/functions",
    "^helpers/mocks$": "<rootDir>/spec/helpers/mocks",
    "^helpers/test-subjects$": "<rootDir>/spec/helpers/test-subjects",
    "^helpers/types$": "<rootDir>/spec/helpers/types",
    "^helpers/mock-builder$": "<rootDir>/spec/helpers/mock-builder",
    "^provider$": "<rootDir>/spec/helpers/module-provider.ts",
  },
  testRegex: [
    '/spec/.*\\.spec.ts$'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/build/'
  ],
  setupFilesAfterEnv: [
    "<rootDir>/spec/helpers/global-after-each.ts"
  ],
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Test Report",
        // theme: "darkTheme",
        styleOverridePath: './dark-theme-test-report.css',
        outputPath: "./spec/test-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
        sort: "status"
      }
    ]
  ]
}
