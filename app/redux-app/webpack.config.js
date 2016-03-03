module.exports = {
  entry: './index.js',
  output: {
    path: __dirname,
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
          presets: ['react', 'es2015', 'stage-0']
        }
      }
    ]
  },
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
    configFile: '../../.eslintrc'
  }
}
