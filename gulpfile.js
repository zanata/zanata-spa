/*eslint-env node*/
'use strict';

var angularTemplatecache = require('gulp-angular-templatecache'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    // debug = require('gulp-debug'),
    env = process.env.NODE_ENV || 'development',
    eslint = require('gulp-eslint'),
    fs = require('fs'),
    gettext = require('gulp-angular-gettext'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    inject = require('gulp-inject'),
    jshint = require('gulp-jshint'),
    mainBowerFiles = require('main-bower-files'),
    merge = require('merge-stream'),
    modulizr = require('gulp-modulizr'),
    ngAnnotate = require('gulp-ng-annotate'),
    notify = require('gulp-notify'),
    paths = require('./gulpfile.paths.js'),
    plumber = require('gulp-plumber'),
    prefix = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace-task'),
    rework = require('gulp-rework'),
    reworkcalc = require('rework-calc'),
    reworkcolor = require('rework-color-function'),
    reworkcustommedia = require('rework-custom-media'),
    reworkielimits = require('rework-ie-limits'),
    reworkNPM = require('rework-npm'),
    reworkvars = require('rework-vars'),
    rimraf = require('gulp-rimraf'),
    sourcemaps = require('gulp-sourcemaps'),
    suitconformance = require('rework-suit-conformance'),
    svgSprite = require('gulp-svg-sprite'),
    uglify = require('gulp-uglify'),
    webserver = require('gulp-webserver');

function notifyError(err) {

  notify.onError({
    title:    'Gulp',
    subtitle: 'Failure!',
    message:  '<%= error.name %>: [<%= error.plugin %>] <%= error.message %>',
    sound:    'Beep'
  })(err);

  this.emit('end');

}

gulp.task('bowerClean', function() {
  return gulp.src(paths.bower, { read: false })
    .pipe(rimraf());
});

gulp.task('bowerMain', ['bowerClean'], function(){
  //concatenate vendor JS files
  return gulp.src(mainBowerFiles(), { base: './bower_components' })
    .pipe(gulp.dest(paths.bower));
});

gulp.task('css', function () {
// Use this when CSS lives here
  return gulp.src(paths.css.app)
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(rework(
      reworkNPM(),
      reworkvars(),
      reworkcalc,
      reworkcolor,
      reworkcustommedia,
      reworkielimits,
      suitconformance,
      { sourcemap: true }
    ))
    .pipe(prefix(
      [
        'Explorer >= 9',
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Safari versions',
        'last 2 iOS versions',
        'Android 4'
      ],
      { cascade: true }
    ))
    .pipe(gulpif(env === 'production', csso()))
    .pipe(gulp.dest(paths.build + '/css'));
});

gulp.task('cssBower', ['bowerMain'], function(){
  return gulp.src(paths.css.bower)
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(concat('libs.css'))
    .pipe(gulpif(env === 'production', csso()))
    .pipe(gulp.dest(paths.build + '/css'));
});

gulp.task('js', function(){
  var jsx = gulp.src(paths.jsx).pipe(babel());
  var js = gulp.src(paths.js.app);

  return merge(jsx, js)
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    // Sourcemaps start
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(gulpif(env === 'production', uglify()))
    // Sourcemaps end
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('modernize', ['bowerMain'], function() {
  return gulp.src(paths.modernizr.src)
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(modulizr([
      'csstransforms3d',
      'csstransforms',
      'svg',
      'touch',
      'cssclasses'
    ]))
    .pipe(rename(paths.modernizr.buildName))
    .pipe(gulp.dest(paths.modernizr.build));
});

// Remove full size modernizr so only custom remains
gulp.task('removeModernizr', ['modernize'], function() {
  return gulp.src(paths.modernizr.build + '/modernizr.js', { read: false })
    .pipe(rimraf());
});

gulp.task('jsBower', ['bowerMain', 'removeModernizr'], function(){
  //concatenate vendor JS files
  return gulp.src(paths.js.bower)
    .pipe(plumber({errorHandler: notifyError}))
    // Sourcemaps start
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(concat('libs.js'))
    .pipe(gulpif(env === 'production', uglify()))
    // Sourcemaps end
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('icons', function () {
  var svgs = gulp.src(paths.icons.app)
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(svgSprite({
      mode: {
        symbol: {
          inline: true
        }
      }
    }))
    .pipe(rename('icons.svg'));

  function fileContents (filePath, file) {
    return file.contents.toString('utf8');
  }

  return gulp.src(paths.app + '/index.html')
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(inject(svgs, {transform: fileContents}))
    .pipe(gulp.dest(paths.build));
});

gulp.task('images', function(){
  return gulp.src(paths.images.app)
    .pipe(plumber({errorHandler: notifyError}))
    // TODO Clean build first
    .pipe(imagemin({ optimizationLevel: 5,
      progressive: true, interlaced: true }))
    .pipe(rename(function(path) {
      path.dirname = path.dirname.replace('components/', '');
    }))
    .pipe(gulp.dest(paths.build + '/images'));
});

gulp.task('imagesBower', ['bowerMain'], function(){
  return gulp.src(paths.images.bower)
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(gulp.dest(paths.build));
});

gulp.task('fontsBower', ['bowerMain'], function(){
  return gulp.src(paths.fonts.bower)
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(gulp.dest(paths.build));
});

gulp.task('templates', function(){
  //combine all template files of the app into a js file
  return gulp.src(paths.templates)
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(angularTemplatecache('templates.js',{standalone:true}))
    .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('config', function() {
  var regex = new RegExp('\"baseUrl\".*,');
  gulp.src(paths.config)
    .pipe(gulpif(env === 'production', replace({
      patterns: [{
        match: regex,
        replacement: ''
      }]
    })))
    .pipe(gulp.dest(paths.build));
});

gulp.task('generatePot', function () {
  return gulp.src(paths.translations.src)
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(gettext.extract('template.pot', {
      // options to pass to angular-gettext-tools...
    }))
    .pipe(gulp.dest(paths.translations.po));
});

gulp.task('filterPotAbsolutePath', ['generatePot'], function () {
  var regex = new RegExp(process.cwd() + '/', 'g');
  gulp.src(paths.translations.po + '/**/*.pot', {base: './'})
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(replace({
      patterns: [{
        match: regex,
        replacement: ''
      }]
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('translations', ['filterPotAbsolutePath'], function () {
  return gulp.src(paths.translations.po + '/**/*.po')
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(gettext.compile({
      format: 'json'
      // options to pass to angular-gettext-tools...
    }))
    .pipe(gulp.dest(paths.translations.build))
    .on('end', generateLocaleList);
});


function generateLocaleList() {
  var extension = 'json';
  var files = fs.readdirSync(paths.translations.build).filter(
    function(file) {
      return file.indexOf(extension, file.length - extension.length) !== -1;
    });

  var contents = '{\"locales\": [';

  for (var i = 0; i < files.length; i++) {
    contents += '\"' + files[i]
      .substring(0, files[i].length - extension.length - 1) + '\"';
    if(i !== files.length - 1) {
      contents += ',';
    }
  }
  contents = contents + ']}';
  fs.writeFile(paths.translations.build + '/' + 'locales',
    contents, function (err) {
    if (err) throw err;
  });
}

gulp.task('copyIndex', ['icons']);

gulp.task('build',
  [
    'jsBower',
    'js',
    'cssBower',
    'css',
    'fontsBower',
    'icons',
    'images',
    'imagesBower',
    'templates',
    'config',
    // 'copyIndex',
    'generatePot',
    'filterPotAbsolutePath',
    'translations'
  ]);

gulp.task('webserver', ['build'], function() {
  gulp.src('build')
    .pipe(webserver({
      livereload: true,
      host: '0.0.0.0',
      port: 8000
    }));
});

gulp.task('serve', ['webserver']);

gulp.task('watch', ['serve'], function(){
  gulp.watch(paths.js.bower, ['jsBower']);
  gulp.watch(paths.js.app, ['js']);
  gulp.watch(paths.jsx, ['js']);
  gulp.watch(paths.css.bower, ['cssBower']);
  gulp.watch(paths.css.all, ['css']);
  gulp.watch(paths.templates, ['templates', 'translations']);
  gulp.watch(paths.images.app, ['images']);
  gulp.watch(paths.images.bower, ['imagesBower']);
  gulp.watch(paths.fonts.bower, ['fontsBower']);
  gulp.watch(paths.app + '/index.html', ['copyIndex']);
});

gulp.task('lint', function () {
  return gulp.src(paths.js.app)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('lint-watch', function () {
  gulp.watch(paths.js.app, ['lint']);
  gulp.watch('.eslintrc', ['lint']);
});

gulp.task('default', ['build']);

