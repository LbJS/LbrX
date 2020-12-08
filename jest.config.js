module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: './spec/tsconfig.json'
    }
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/internal/types/*",
    "!src/internal/stores/store-accessories/types/*",
  ],
  moduleNameMapper: {
    "^lbrx$": "<rootDir>/src",
    "^lbrx/core$": "<rootDir>/src/core",
    "^lbrx/dev-tools$": "<rootDir>/src/dev-tools",
    "^lbrx/utils$": "<rootDir>/src/utils",
    "^lbrx/query$": "<rootDir>/src/query",
    "^lbrx/internal/core$": "<rootDir>/src/internal/core",
    "^lbrx/internal/helpers$": "<rootDir>/src/internal/helpers",
    "^lbrx/internal/helpers/helper-functions$": "<rootDir>/src/internal/helpers/helper-functions",
    "^lbrx/internal/helpers/shortened-functions$": "<rootDir>/src/internal/helpers/shortened-functions",
    "^lbrx/internal/types$": "<rootDir>/src/internal/types",
    "^lbrx/internal/dev-tools$": "<rootDir>/src/internal/dev-tools",
    "^lbrx/internal/dev-tools/config$": "<rootDir>/src/internal/dev-tools/config",
    "^lbrx/internal/stores$": "<rootDir>/src/internal/stores",
    "^lbrx/internal/stores/config$": "<rootDir>/src/internal/stores/config",
    "^lbrx/internal/stores/store-accessories$": "<rootDir>/src/internal/stores/store-accessories",
    "^__test__$": "<rootDir>/spec/__test__",
    "^__test__/factories$": "<rootDir>/spec/__test__/factories",
    "^__test__/functions$": "<rootDir>/spec/__test__/functions",
    "^__test__/mocks$": "<rootDir>/spec/__test__/mocks",
    "^__test__/test-subjects$": "<rootDir>/spec/__test__/test-subjects",
    "^__test__/types$": "<rootDir>/spec/__test__/types",
    "^__test__/mock-builder$": "<rootDir>/spec/__test__/mock-builder",
    "^provider$": "<rootDir>/spec/__test__/module-provider.ts",
  },
  testRegex: [
    '/spec/.*\\.spec.ts$'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/spec/performance-test-report.log.json',
  ],
  setupFilesAfterEnv: [
    "<rootDir>/spec/__test__/setup/jasmine-env-add-reporter.ts",
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
