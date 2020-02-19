const path = require('path');

module.exports = {
	entry: './playground/main.ts',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			lbrx: path.resolve(__dirname, 'lbrx')
		}
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'playground'),
	},
};
