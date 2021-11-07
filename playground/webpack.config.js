const path = require('path')
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { argv } = require('process')

/** @type {import('webpack').Configuration} */
const COMMON_CONFIG = {
  entry: {
    main: [
      './playground/src/main.tsx',
      './playground/src/styles.scss',
    ],
  },
  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        exclude: [
          path.resolve(__dirname, 'src/styles.scss'),
        ],
        sideEffects: true,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        include: [
          path.resolve(__dirname, 'src/styles.scss'),
          path.resolve(__dirname, 'src/styles'),
        ],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
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
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: './playground/src/index.html'
    }),
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

/** @type {import('webpack').Configuration} */
const COMMON_LOADING_SCRIPT_CONFIG = {
  entry: {
    'loading-script': './playground/src/loading-script.ts'
  },
  target: ['web', 'es5'],
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
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
}

/** @type {import('webpack').Configuration} */
const DEV_LOADING_SCRIPT_CONFIG = {
  devtool: 'inline-source-map',
}

/** @type {import('webpack').Configuration} */
const PROD_LOADING_SCRIPT_CONFIG = {
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
}

const ENABLE_CLEAN = true

const IS_PROD = (() => {
  const mode = getMode()
  return mode === 'production'
})()

module.exports = buildFinalConfig()

function getMode() {
  const modeIndex = argv.indexOf('--mode')
  if (modeIndex == -1) return null
  return argv[modeIndex + 1] ?? null
}

function buildFinalConfig() {
  const configBuilders = [buildMainConfig, buildLoadingScriptConfig]
  const finalConfig = buildConfigs(configBuilders)
  return finalConfig
}

function buildConfigs(configs) {
  const result = configs.map((builder, index) => {
    const config = builder()
    if (index == 0 && ENABLE_CLEAN) config.output.clean = true
    return config
  })
  if (ENABLE_CLEAN) result.parallelism = 1
  return result
}

function buildMainConfig() {
  const mainConfig = merge(COMMON_CONFIG, IS_PROD ? PROD_CONFIG : DEV_CONFIG)
  const envFilePath = `./src/environment/${IS_PROD ? 'prod' : 'dev'}.ts`
  mainConfig.resolve.alias['environment'] = path.resolve(__dirname, envFilePath)
  return mainConfig
}

function buildLoadingScriptConfig() {
  const loadingScriptConfig = merge(COMMON_LOADING_SCRIPT_CONFIG, IS_PROD ? DEV_LOADING_SCRIPT_CONFIG : PROD_LOADING_SCRIPT_CONFIG)
  return loadingScriptConfig
}
