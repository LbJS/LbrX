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
    "^test-subjects$": "<rootDir>/spec/test-subjects",
    "^mocks$": "<rootDir>/spec/mocks",
    "^factories$": "<rootDir>/spec/factories",
    "^types$": "<rootDir>/spec/types",
    "^helpers$": "<rootDir>/spec/helpers",
    "^provider.module$": "<rootDir>/spec/provider.module.ts",
    "^mock-builder$": "<rootDir>/spec/mock-builder.ts",
  },
  testRegex: [
    '/spec/.*\\.spec.ts$'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/build/'
  ],
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Test Report",
        theme: "darkTheme",
        outputPath: "./spec/test-results-output/test-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
        sort: "status"
      }
    ]
  ]
}
