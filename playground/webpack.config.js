const path = require('path')

module.exports = {
  entry: {
    main: './playground/ts/main.ts',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: "playground/tsconfig.json"
          }
        }],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      lbrx: path.resolve(__dirname, '../src')
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'www'),
  },
}
