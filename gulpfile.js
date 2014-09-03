var gulp = require('gulp'),
  csso = require('gulp-csso'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  rimraf = require('gulp-rimraf'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  fs = require('fs'),
  debug = require('gulp-debug'),
  webserver = require('gulp-webserver'),
  mainBowerFiles = require('main-bower-files'),
  ngAnnotate = require('gulp-ng-annotate'),
  gettext = require('gulp-angular-gettext'),
  rework = require('gulp-rework'),
  reworkcalc = require('rework-calc'),
  reworkcustommedia = require('rework-custom-media'),
  reworkielimits = require('rework-ie-limits'),
  reworkNPM = require('rework-npm'),
  reworkcolor = require('rework-color-function'),
  suitconformance = require('rework-suit-conformance'),
  reworkvars = require('rework-vars'),
  prefix = require('gulp-autoprefixer');
  angularTemplatecache = require('gulp-angular-templatecache'),
  pathBuild = './build',
  pathDeps = './bower_main',
  pathJSdeps = [pathDeps + '/**/angular.js', pathDeps + '/**/*.js'] // Get Angular first
  pathJSapp = ['./app/app.js','./app/**/*.js'], // Get app definition first
  pathCSSdeps = pathDeps + '/**/*.css',
  pathCSSapp = './app/**/*.css',
  pathFontdeps = pathDeps + '/**/fonts/**/*',
  pathImagedeps = pathDeps + '/**/img/**/*',
  pathTemplates = ['!./app/index.html', './app/**/*.html'],
  pathTranslation = pathBuild + '/translations',
  pathTranslationSrc = './app/components/translations';

gulp.task('bowerClean', function() {
  return gulp.src(pathDeps, { read: false })
    .pipe(rimraf());
});

gulp.task('bowerMain', ['bowerClean'], function(){
  //concatenate vendor JS files
  return gulp.src(mainBowerFiles(), { base: './bower_components' })
    .pipe(gulp.dest(pathDeps));
});

gulp.task('css', function () {
// Use this when CSS lives here
  return gulp.src(pathCSSapp)
    .pipe(gulp.dest(pathBuild + '/css'));
});

gulp.task('cssDeps', ['bowerMain'], function(){
  return gulp.src(pathCSSdeps)
    .pipe(concat('libs.css'))
    .pipe(gulp.dest(pathBuild + '/css'));
});

gulp.task('js',function(){
  return gulp.src(pathJSapp)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(pathBuild + '/js'));
});

gulp.task('jsDeps', ['bowerMain'], function(){
  //concatenate vendor JS files
  return gulp.src(pathJSdeps)
    .pipe(ngAnnotate())
    .pipe(concat('libs.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(pathBuild + '/js'));
});

gulp.task('imageDeps', ['bowerMain'], function(){
  return gulp.src(pathImagedeps)
    .pipe(rename(function(path) {
      path.dirname = path.dirname.replace('zanata-assets/php/master/assets/', '');
    }))
    .pipe(gulp.dest(pathBuild));
});

gulp.task('fontDeps', ['bowerMain'], function(){
  return gulp.src(pathFontdeps)
    .pipe(rename(function(path) {
      path.dirname = path.dirname.replace('zanata-assets/php/master/assets/', '');
    }))
    .pipe(gulp.dest(pathBuild));
});

gulp.task('templates', function(){
  //combine all template files of the app into a js file
  return gulp.src(pathTemplates)
    .pipe(angularTemplatecache('templates.js',{standalone:true}))
    .pipe(gulp.dest(pathBuild + '/js'));
});

gulp.task('pot', function () {
  return gulp.src(pathTemplates)
    .pipe(gettext.extract('template.pot', {
      // options to pass to angular-gettext-tools...
    }))
    .pipe(gulp.dest(pathTranslationSrc));
});

gulp.task('translations', function () {
  return gulp.src(pathTranslationSrc + '/**/*.po')
    .pipe(gettext.compile({
      format: 'json'
      // options to pass to angular-gettext-tools...
    }))
    .pipe(gulp.dest(pathTranslation))
    .on('end', generateLocaleList);
});


function generateLocaleList() {
  var extension = 'json';
  var files = fs.readdirSync(pathTranslation).filter(
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
  fs.writeFile(pathTranslation + '/' + 'locales', contents, function (err) {
    if (err) throw err;
  });
}

gulp.task('copyIndex', function() {
  return gulp.src('./app/index.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('build', ['jsDeps', 'js', 'cssDeps', 'css', 'fontDeps', 'imageDeps',
  'templates', 'copyIndex', 'pot', 'translations']);

gulp.task('webserver', ['build'], function() {
  gulp.src('build')
    .pipe(webserver({
      livereload: true
    }));
});

gulp.task('serve', ['webserver']);

gulp.task('watch', ['serve'], function(){
  gulp.watch(pathJSdeps, ['jsDeps']);
  gulp.watch(pathJSapp, ['js']);
  gulp.watch(pathCSSdeps, ['cssDeps']);
  gulp.watch(pathCSSapp, ['css']);
  gulp.watch(pathTemplates, ['templates']);
  gulp.watch('./app/index.html', ['copyIndex']);
});

gulp.task('default',['build']);
