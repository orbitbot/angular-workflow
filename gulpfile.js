var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var templatecache = require('gulp-angular-templatecache');
var karma = require('karma').server;
var _ = require('lodash');
var browserSync = require("browser-sync");
var at = require('gulp-asset-transform');

var minifyCss = require('gulp-minify-css');

var paths = {
  css        : ['src/assets/css/*.css', 'src/app/**/*.css'],
  fonts      : 'src/assets/fonts/*.*',
  images     : 'src/assets/images/**',
  index      : 'src/index.html',
  js         : 'src/app/**/*.js',
  jsHintConf : 'config/.jshintrc',
  less       : ['src/assets/less/*.less', 'src/app/**/**/*.less'],
  templates  : 'src/app/components/**/*.html'
};


gulp.task('copy-images', function() {
  return gulp.src(paths.images)
    .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(plugins.size({ title: 'images', showFiles: true }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('copy-fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(plugins.size({ title: 'fonts' }))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('at-build', function() {
  return gulp.src(paths.index)
    .pipe(at({
      css: {
        tasks: ['concat',
                plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'),
                plugins.size({ title: 'css', showFiles: true })]
      },
      js: {
        tasks: ['concat']
      },
      less: {
        tasks: ['concat',
                plugins.less(),
                plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'),
                plugins.size({ title: 'less', showFiles: true})]
      }
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('templates', function () {
  return gulp.src(paths.templates)
    .pipe(templatecache('templates.js', { standalone: true }))
    .pipe(plugins.size({ title: 'templates' }))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({ stream: true }));
});


var karmaConf = require('./config/karma.conf');

gulp.task('karma', function(done) {
  karma.start(_.assign({}, karmaConf, { singleRun: true, colors: true }), done);
});

gulp.task('karma-ci', function(done) {
  karma.start(_.assign({}, karmaConf, { singleRun: false, colors: true, autoWatch: true }), done);
});

gulp.task('jshint', function() {
  gulp.src(paths.js)
    .pipe(plugins.jshint(paths.jsHintConf))
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});


gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    port: '8080',
    logConnections: true,
    open: false
  });
});

gulp.task('watch', function() {
  gulp.watch([paths.index, paths.css, paths.less, paths.js], ['at-build']);
  gulp.watch([paths.images, paths.fonts], ['copy-assets']);
  gulp.watch([paths.templates], ['templates']);
  gulp.watch([paths.js], ['jshint']);
});

gulp.task('copy-assets', ['copy-images', 'copy-fonts']);
gulp.task('build', ['at-build', 'templates', 'copy-assets']);
gulp.task('default', ['build', 'server', 'watch']);
