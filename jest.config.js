module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	reporters: [
		"default",
		[
			"./node_modules/jest-html-reporter",
			{
				pageTitle: "Test Report",
				theme: "darkTheme",
				outputPath: "./tests/test-results/test-report.html"
			}
		]
	]
};
