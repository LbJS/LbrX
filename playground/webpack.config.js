const path = require('path')
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyPlugin = require('copy-webpack-plugin')

/** @type {import('webpack').Configuration} */
const COMMON_CONFIG = {
  entry: {
    main: [
      './playground/src/main.tsx',
      './playground/src/styles.scss'
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'playground/tsconfig.json',
          }
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: './playground/src/index.html'
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    alias: {
      lbrx: path.resolve(__dirname, '../src'),
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
}

/** @type {import('webpack').Configuration} */
const DEV_CONFIG = {
  devtool: 'inline-source-map',
}

/** @type {import('webpack').Configuration} */
const PROD_CONFIG = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: false,
        terserOptions: {
          mangle: true
        },
      })
    ],
  },
  performance: {
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.css') || assetFilename.endsWith('.html')
    }
  }
}

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'
  const finalConfig = merge(COMMON_CONFIG, isProd ? PROD_CONFIG : DEV_CONFIG)
  const envFilePath = `./src/environment/${isProd ? 'prod' : 'dev'}.ts`
  finalConfig.resolve.alias.environment = path.resolve(__dirname, envFilePath)
  return finalConfig
}
