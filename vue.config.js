const path = require('path')

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

module.exports = {
  publicPath: './',
  css: {
    loaderOptions: {
      stylus: {
        import: resolve('./src/assets/stylus/variable.styl')
      }
    }
  }
}
