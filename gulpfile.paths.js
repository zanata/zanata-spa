/**
 * Path Definitions
 */

var paths = {};

paths.app = './app';
paths.build = './build';
paths.bower = './bower_main';
paths.config = paths.app + '/config.json';
paths.css = {
  all: paths.app + '/**/*.css',
  app: paths.app + '/app.css',
  bower: paths.bower + '/**/*.css'
};
paths.fonts = {
  bower: paths.bower + '/**/fonts/**/*'
};
paths.icons = {
  app: paths.app + '/components/icon/images/*.svg'
};
paths.images = {
  app: [
    '!' + paths.icons.app,
    paths.app + '/**/*.svg',
    paths.app + '/**/*.jpg',
    paths.app + '/**/*.png',
    paths.app + '/**/*.gif'
  ],
  bower: paths.bower + '/**/img/**/*'
};



// entry point(s) for webpack build
paths.webpackEntry = paths.app + '/**/editorHeaderDirective.js';

paths.js = {
  app: [
    paths.app + '/app.js',
    paths.app + '/**/*.js',
    // compiled to bundle by webpack, so exclude
    '!' + paths.webpackEntry
  ],
  bower: [
    paths.bower + '/**/angular.js',
    paths.bower + '/**/*.js'
  ]
};
paths.jsx = paths.app + '/**/*.jsx';

paths.modernizr = {
  src: paths.bower + '/modernizr/modernizr.js',
  build: paths.bower + '/modernizr',
  buildName: 'modernizr-custom.js'
};
paths.templates = ['!' + paths.app + '/index.html', paths.app + '/**/*.html'];
paths.translations = {
  build: paths.build + '/translations',
  po: paths.app + '/components/translations',
  src: {
    plain: [
      paths.app + '/**/*.html',
      paths.app + '/**/*.js'
    ],
    // has to be run through babel
    jsx: paths.app + '/**/*.jsx'
  }
};

module.exports = paths;
