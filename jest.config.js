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
    "^helpers$": "<rootDir>/spec/__test__",
    "^helpers/factories$": "<rootDir>/spec/__test__/factories",
    "^helpers/functions$": "<rootDir>/spec/__test__/functions",
    "^helpers/mocks$": "<rootDir>/spec/__test__/mocks",
    "^helpers/test-subjects$": "<rootDir>/spec/__test__/test-subjects",
    "^helpers/types$": "<rootDir>/spec/__test__/types",
    "^helpers/mock-builder$": "<rootDir>/spec/__test__/mock-builder",
    "^provider$": "<rootDir>/spec/__test__/module-provider.ts",
  },
  testRegex: [
    '/spec/.*\\.spec.ts$'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/build/'
  ],
  setupFilesAfterEnv: [
    "<rootDir>/spec/__test__/setup/env.ts",
    "<rootDir>/spec/__test__/setup/global-before-each.ts",
    "<rootDir>/spec/__test__/setup/global-after-each.ts",
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
