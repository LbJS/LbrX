const path = require('path')
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { argv } = require('process')

const IS_PROD = (() => {
  const mode = getMode()
  return mode === 'production'
})()
const FOLDERS = {
  playground: __dirname,
  src: path.resolve(__dirname, 'src'),
  environment: path.resolve(__dirname, 'src/environment'),
  styles: path.resolve(__dirname, 'src/styles'),
  lbrxSrc: path.resolve(__dirname, '../src'),
  dist: path.resolve(__dirname, '../dist'),
  nodeModules: path.resolve(__dirname, '../node_modules'),
}
const ENTRIES = {
  mainTSX: path.resolve(FOLDERS.src, 'main.tsx'),
  styles: path.resolve(FOLDERS.src, 'styles.scss'),
  loadingScript: path.resolve(FOLDERS.src, 'loading-script.ts')
}
const REGEXES = {
  tsx: /\.tsx?$/,
  scss: /\.(s[ac]|c)ss$/i,
  js: /\.js(\?.*)?$/i,
  nodeModules: /node_modules/,
}
const CONFIGS = {
  ts: path.resolve(FOLDERS.playground, 'tsconfig.json')
}
const DEV_TOOLS_OPTION = 'inline-source-map'
const OUTPUT = {
  fileNameFormat: '[name].js'
}
const CDN = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize${IS_PROD ? '.min' : ''}.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize${IS_PROD ? '.min' : ''}.js"></script>`

/** @type {import('webpack').Configuration} */
const COMMON_CONFIG = {
  entry: {
    main: [
      ENTRIES.mainTSX,
      ENTRIES.styles,
    ],
  },
  module: {
    rules: [
      {
        test: REGEXES.scss,
        exclude: [
          ENTRIES.styles,
        ],
        sideEffects: true,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: REGEXES.scss,
        include: [
          ENTRIES.styles,
          FOLDERS.styles,
        ],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: REGEXES.tsx,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: CONFIGS.ts,
          }
        }],
        exclude: REGEXES.nodeModules,
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(FOLDERS.dist, 'index.html'),
      template: path.resolve(FOLDERS.src, 'index.html'),
      cdn: CDN
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    alias: {
      lbrx: FOLDERS.lbrxSrc,
    },
    modules: [
      FOLDERS.playground,
      FOLDERS.nodeModules,
    ]
  },
  output: {
    filename: OUTPUT.fileNameFormat,
    path: FOLDERS.dist,
  },
}

/** @type {import('webpack').Configuration} */
const DEV_CONFIG = {
  devtool: DEV_TOOLS_OPTION,
}

/** @type {import('webpack').Configuration} */
const PROD_CONFIG = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: REGEXES.js,
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
    'loading-script': ENTRIES.loadingScript
  },
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: CONFIGS.ts,
          }
        }],
        exclude: REGEXES.nodeModules,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },
  output: {
    filename: OUTPUT.fileNameFormat,
    path: FOLDERS.dist,
  },
}

/** @type {import('webpack').Configuration} */
const DEV_LOADING_SCRIPT_CONFIG = {
  devtool: DEV_TOOLS_OPTION,
}

/** @type {import('webpack').Configuration} */
const PROD_LOADING_SCRIPT_CONFIG = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: REGEXES.js,
        extractComments: false,
        terserOptions: {
          mangle: true
        },
      })
    ],
  },
}

const ENABLE_CLEAN = true

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
  const envFileName = `${IS_PROD ? 'prod' : 'dev'}.ts`
  mainConfig.resolve.alias['environment'] = path.resolve(FOLDERS.environment, envFileName)
  return mainConfig
}

function buildLoadingScriptConfig() {
  const loadingScriptConfig = merge(COMMON_LOADING_SCRIPT_CONFIG, IS_PROD ? DEV_LOADING_SCRIPT_CONFIG : PROD_LOADING_SCRIPT_CONFIG)
  return loadingScriptConfig
}
