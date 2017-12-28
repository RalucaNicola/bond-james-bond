module.exports = {
  entry: {
    main: [
      './src/js/main.js'
    ]
  },
  output: {
    filename: './dist/[name].bundle.js',
    libraryTarget: 'amd'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["es2015"]
          }
        }
      }
    ]
  },
  devtool: 'source-map'
}