const path = require('path');

module.exports = {
	entry: './playground/main.ts',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [{
					loader: 'ts-loader?configFile=playground/tsconfig.json',
				}],
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			src: path.resolve(__dirname, 'src')
		}
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'playground'),
	},
};
