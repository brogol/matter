'use strict';

var del = require('del');
var gm = require('gray-matter');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var data = require('gulp-data');
var nunjucks = require('gulp-nunjucks-render');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var server = require('gulp-server-livereload');

var config = {
  data: 'config.yml',
  css: {
    dir: 'sass',
    ext: 'scss',
    dest: 'public/assets/css'
  },
  pages: {
    dir: 'pages',
    ext: 'html',
    dest: 'public'
  },
  templates: {
    dir: 'templates',
    ext: 'html',
  },
}

for(var row in config) { // Add property src: dir/**/*.ext
  if(typeof config[row].dir !== 'undefined') {
    config[row].src = config[row].dir + '/**/*.' + config[row].ext;
  }
}


// Error log
function logError(err) {
  console.error(
    '\x1b[31mError\x1b[0m in plugin \'\x1b[36m' + err.plugin + '\x1b[0m\'',
    '\nName: ' + err.name + '\nFile: ' + err.fileName + '\nMessage: ' + err.message + '\n'
  );
}

// Compile sass to css
gulp.task('sass', function() {
  gulp.src(config.css.src)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(config.css.dest));
});

// Nunjucks templating
gulp.task('render', function() {
  // Render all pages
  gulp.src(config.pages.src)
    .pipe(data(function (file) {
      var page = gm(String(file.contents)), // front matter data
          site = gm.read(config.data); // global data
      file.contents = new Buffer(page.content);
      var json = page.data;
      json.site = site.data;
      return json;
    })).on('error', logError)
    .pipe(nunjucks({
      path: config.templates.dir +'/',
      envOptions: {
        autoescape: false
      },
    })).on('error', logError)
    .pipe(rename(function (path) {
      if(path.basename != 'index') {
        path.dirname += '/' + path.basename;
        path.basename = 'index';
      }
      return path;
    })).on('error', logError)
    .pipe(gulp.dest(config.pages.dest));
});

// Server with livereload
gulp.task('server', function() {
  gulp.src(config.pages.dest)
    .pipe(server({
      livereload: true,
      open: true,
    }));
});

// Watch file changes
gulp.task('watch', function () {
  gulp.watch(config.css.src, ['sass']).on('change', function (event) {
    if (event.type === 'deleted') { // Delete also the public file
      if (event.path.indexOf('/_') == -1) { // If not a partial
        var regex = new RegExp(config.css.dir + '\/(.*)\.' + config.css.ext);
        var toDel = event.path.match(regex)[1];
        del(config.css.dest + '/' + toDel + '.css');
      }
    }
  });
  gulp.watch(config.pages.src, ['render']).on('change', function (event) {
    // Clean destination folder
    del.sync([config.pages.dest + '/**/*', '!public/assets/**']);
  });
  gulp.watch(config.templates.src, ['render']);
  gulp.watch(config.data, ['render']);
});

// Default task
gulp.task('default', ['sass', 'render', 'server', 'watch']);
