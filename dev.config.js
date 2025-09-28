// Development Configuration
module.exports = {
  // Live Server Configuration
  server: {
    port: 3000,
    host: 'localhost',
    root: './',
    open: '/index.html',
    file: 'index.html',
    wait: 1000,
    logLevel: 2,
    middleware: [],
  },

  // File Watching Configuration
  watch: {
    paths: ['css/**/*.css', 'js/**/*.js', '*.html', 'assets/**/*'],
    ignored: ['node_modules/**', '.git/**', 'dist/**', '*.log'],
    options: {
      ignoreInitial: true,
      persistent: true,
      followSymlinks: false,
    },
  },

  // Build Configuration
  build: {
    outputDir: 'dist',
    publicPath: './',
    assetsDir: 'assets',
    filenameHashing: true,
    productionSourceMap: false,
  },

  // CSS Processing
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {},
  },

  // JavaScript Processing
  js: {
    minify: true,
    sourceMap: false,
    transpile: true,
  },

  // Image Optimization
  images: {
    quality: {
      jpg: 85,
      png: 90,
      webp: 85,
    },
    formats: ['jpg', 'png', 'webp', 'svg'],
  },
};
