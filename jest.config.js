module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: './spec/tsconfig.json'
    }
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/internal/types/*",
    "!src/internal/helpers/accessories/*",
  ],
  moduleNameMapper: {
    "^lbrx$": "<rootDir>/src",
    "^lbrx/core$": "<rootDir>/src/core",
    "^lbrx/dev-tools$": "<rootDir>/src/dev-tools",
    "^lbrx/utils$": "<rootDir>/src/utils",
    "^lbrx/internal/core$": "<rootDir>/src/internal/core",
    "^lbrx/internal/helpers$": "<rootDir>/src/internal/helpers",
    "^lbrx/internal/types$": "<rootDir>/src/internal/types",
    "^lbrx/internal/dev-tools$": "<rootDir>/src/internal/dev-tools",
    "^lbrx/internal/stores$": "<rootDir>/src/internal/stores",
    "^lbrx/internal/stores/config$": "<rootDir>/src/internal/stores/config",
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
    "<rootDir>/spec/helpers/setup/env.ts",
    "<rootDir>/spec/helpers/setup/global-before-each.ts",
    "<rootDir>/spec/helpers/setup/global-after-each.ts",
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
