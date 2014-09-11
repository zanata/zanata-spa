var angularTemplatecache = require('gulp-angular-templatecache'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    debug = require('gulp-debug'),
    fs = require('fs'),
    gettext = require('gulp-angular-gettext'),
    gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    mainBowerFiles = require('main-bower-files'),
    modulizr = require('gulp-modulizr'),
    ngAnnotate = require('gulp-ng-annotate'),
    notify = require('gulp-notify'),
    paths = require('./gulpfile.paths.js'),
    prefix = require('gulp-autoprefixer');
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
    suitconformance = require('rework-suit-conformance'),
    uglify = require('gulp-uglify'),
    webserver = require('gulp-webserver');

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
    .pipe(rework(
      reworkNPM(),
      reworkvars(),
      reworkcalc,
      reworkcolor,
      reworkcustommedia,
      reworkielimits,
      suitconformance
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
    .pipe(gulp.dest(paths.build + '/css'))
    .pipe(csso())
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest(paths.build + '/css'));
});

gulp.task('cssBower', ['bowerMain'], function(){
  return gulp.src(paths.css.bower)
    .pipe(concat('libs.css'))
    .pipe(gulp.dest(paths.build + '/css'));
});

gulp.task('js',function(){
  return gulp.src(paths.js.app)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('modernize', ['bowerMain'], function() {
  return gulp.src(paths.modernizr.src)
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
    .pipe(ngAnnotate())
    .pipe(concat('libs.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('images', function(){
  return gulp.src(paths.images.app)
    // TODO Clean build first
    .pipe(rename(function(path) {
      path.dirname = path.dirname.replace('components/', '');
    }))
    .pipe(gulp.dest(paths.build + '/images'));
});

gulp.task('imagesBower', ['bowerMain'], function(){
  return gulp.src(paths.images.bower)
    .pipe(rename(function(path) {
      path.dirname = path.dirname.replace('zanata-assets/php/master/assets/', '');
    }))
    .pipe(gulp.dest(paths.build));
});

gulp.task('fontsBower', ['bowerMain'], function(){
  return gulp.src(paths.fonts.bower)
    .pipe(rename(function(path) {
      path.dirname = path.dirname.replace('zanata-assets/php/master/assets/', '');
    }))
    .pipe(gulp.dest(paths.build));
});

gulp.task('templates', function(){
  //combine all template files of the app into a js file
  return gulp.src(paths.templates)
    .pipe(angularTemplatecache('templates.js',{standalone:true}))
    .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('generatePot', function () {
  return gulp.src(paths.translations.src)
    .pipe(gettext.extract('template.pot', {
      // options to pass to angular-gettext-tools...
    }))
    .pipe(gulp.dest(paths.translations.po));
});

gulp.task('filterPotAbsolutePath', ['generatePot'], function () {
  var regex = new RegExp(process.cwd() + '/', 'g');
  gulp.src(paths.translations.po + '/**/*.pot', {base: './'})
    .pipe(replace({
      patterns: [{
        match: regex,
        replacement: ''
      }]
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('translations', ['filterPotAbsolutePath'], function () {
  return gulp.src(paths.translations.po + '/**/*.po')
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

  for (i = 0; i < files.length; i++) {
    contents += '\"' + files[i].substring(0, files[i].length - extension.length - 1) + '\"';
    if(i !== files.length - 1) {
      contents += ',';
    }
  }
  contents = contents + ']}';
  fs.writeFile(paths.translations.build + '/' + 'locales', contents, function (err) {
    if (err) throw err;
  });
}

gulp.task('copyIndex', function() {
  return gulp.src(paths.app + '/index.html')
    .pipe(gulp.dest(paths.build));
});

gulp.task('build',
  [
    'jsBower',
    'js',
    'cssBower',
    'css',
    'fontsBower',
    'images',
    'imagesBower',
    'templates',
    'copyIndex',
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
  gulp.watch(paths.css.bower, ['cssBower']);
  gulp.watch(paths.css.app, ['css']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch(paths.images.app, ['images']);
  gulp.watch(paths.images.bower, ['imagesBower']);
  gulp.watch(paths.fonts.bower, ['fontsBower']);
  gulp.watch(paths.app + '/index.html', ['copyIndex']);
});

gulp.task('default', ['build']);
