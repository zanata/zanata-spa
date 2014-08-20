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
  webserver = require('gulp-webserver'),
  mainBowerFiles = require('main-bower-files'),
  ngAnnotate = require('gulp-ng-annotate'),
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
  pathJSapp = './app/**/*.js',
  pathCSSdeps = pathDeps + '/**/*.css',
  pathCSSapp = './app/**/*.css',
  pathFontdeps = pathDeps + '/**/fonts/**/*',
  pathImagedeps = pathDeps + '/**/img/**/*',
  pathTemplates = ['!./app/index.html', './app/**/*.html'];

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
    .pipe(gulp.dest(pathBuild));
});

gulp.task('cssDeps', ['bowerMain'], function(){
  return gulp.src(pathCSSdeps)
    .pipe(concat('libs.css'))
    .pipe(gulp.dest(pathBuild));
});

gulp.task('js',function(){
  return gulp.src(pathJSapp)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(pathBuild));
});

gulp.task('jsDeps', ['bowerMain'], function(){
  //concatenate vendor JS files
  return gulp.src(pathJSdeps)
    .pipe(ngAnnotate())
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest(pathBuild));
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
    .pipe(gulp.dest(pathBuild));
});

gulp.task('copyIndex', function() {
  return gulp.src('./app/index.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('build', ['jsDeps', 'js', 'cssDeps', 'css', 'fontDeps', 'imageDeps', 'templates', 'copyIndex']);

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
