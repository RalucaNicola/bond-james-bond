module.exports = {
  entry: {
    main: [
      './src/js/main.js'
    ]
  },
  output: {
    filename: './dist/[name].bundle.js',
    libraryTarget: 'amd'
  }
}