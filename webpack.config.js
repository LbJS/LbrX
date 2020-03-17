const path = require('path');

module.exports = {
	entry: './www/main.ts',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [{
					loader: 'ts-loader?configFile=www/tsconfig.json',
				}],
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			lbrx: path.resolve(__dirname, 'src')
		}
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'www'),
	},
};
