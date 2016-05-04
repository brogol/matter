'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var server = require('gulp-server-livereload');
var nunjucks = require('gulp-nunjucks-render');
var rename = require('gulp-rename');

var paths = {
  css: {
    src: 'sass/**/*.scss',
    dest: 'public/css'
  },
  html: {
    pages: 'pages/**/*.html',
    templates: 'templates/**/*.html',
    dest: 'public'
  }
};

// Compile sass to css
gulp.task('sass', function() {
  gulp.src(paths.css.src)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.css.dest));
});

// Nunjucks templating
gulp.task('render', function() {
  gulp.src(paths.html.pages)
    .pipe(nunjucks({path: 'templates/'}))
    .pipe(rename(function (path) {
      if(path.basename != 'index') {
        path.dirname = path.basename;
        path.basename = 'index';
      }
      return path;
    }))
    .pipe(gulp.dest(paths.html.dest));
});

// Server with livereload
gulp.task('server', function() {
  gulp.src(paths.html.dest)
    .pipe(server({
      livereload: true,
      open: true
    }));
});

// Watch file changes
gulp.task('watch', function () {
  gulp.watch(paths.css.src, ['sass']);
  gulp.watch(paths.html.pages, ['render']);
  gulp.watch(paths.html.templates, ['render']);
});

// Default task
gulp.task('default', ['sass', 'render', 'server', 'watch']);
