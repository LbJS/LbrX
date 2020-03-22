module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			tsConfig: './spec/tsconfig.json'
		}
	},
	moduleNameMapper: {
		"lbrx/helpers": "<rootDir>/src/helpers",
		"test-subjects": "<rootDir>/spec/test-subjects",
	},
	reporters: [
		"default",
		[
			"./node_modules/jest-html-reporter",
			{
				pageTitle: "Test Report",
				theme: "darkTheme",
				outputPath: "./spec/test-results-output/test-report.html"
			}
		]
	]
};
