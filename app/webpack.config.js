var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var join = require('path').join
var reworkCalc = require('rework-calc')
var reworkColorFunction = require('rework-color-function')
var reworkCustomMedia = require('rework-custom-media')
var reworkIeLimits = require('rework-ie-limits')
var reworkNpm = require('rework-npm')
var reworkVars = require('rework-vars')
var reworkSuitConformance = require('rework-suit-conformance')

module.exports = {
  entry: './index.js',
  output: {
    path: join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [
            ['react-intl', {
              messagesDir: './build/messages/',
              enforceDescriptions: true
            }]
          ]
        }
      },
      {
        test: /\.css$/,
        // I may have broken it with this, telling it to ignore anything in
        // these directories?
        exclude: /(node_modules|bower_components)/,
        loader: ExtractTextPlugin.extract('style', 'css!csso!postcss!rework')
      }
    ]
  },

  plugins: [
    // used to output css to a separate file
    // FIXME just using monkeys as an identifiable name while configuring
    new ExtractTextPlugin('app.css')
  ],

  resolve: {
    // subdirectories to check while searching up tree for module
    // TODO remove when components migrated to use .js
    extensions: ['', '.js', '.jsx']
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true
  },
  eslint: {
    // FIXME change when redux app moved up a level
    configFile: '../.eslintrc'
  },

  /* Used just to run autoprefix */
  postcss: [
    autoprefixer({
      browsers: [
        'Explorer >= 9',
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Safari versions',
        'last 2 iOS versions',
        'Android 4'
      ]
    })
  ],

  /* enables a range of syntax improvements and checks for css files */
  rework: {
    use: [
      reworkNpm(),
      reworkVars(),
      reworkCalc,
      reworkColorFunction,
      reworkCustomMedia,
      reworkIeLimits,
      reworkSuitConformance
    ]
  }
}
