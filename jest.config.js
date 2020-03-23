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
		"^test-subjects$": "<rootDir>/spec/test-subjects",
	},
	testRegex: [
		'/spec/.*\\.spec.ts$'
	],
	modulePathIgnorePatterns: [
		'<rootDir>/lib/'
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
};
