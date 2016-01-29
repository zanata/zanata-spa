module.exports = {
  entry: "./index.js",
  output: {
      path: __dirname,
      filename: "bundle.js"
  },
  module: {
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
  devServer: {
    historyApiFallback: true
  }
};
