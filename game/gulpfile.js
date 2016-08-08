var gulp = require('gulp');
var less = require('gulp-less');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var collector = require('gulp-rev-collector');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var path = {
  css: 'assets/css',
  js: 'assets/js',
  images: 'assets/images',
  components: 'assets/components'
};

// 默认监听
gulp.task('default', function () {
  gulp.watch('public/less/**/*.less', ['less']);

  browserSync.init({
      proxy: 'http://localhost:15350/',
      port: 15350,
      reloadDelay: 1000,
  });

  gulp.watch(['models/**/*', 'public/**/*', 'routes/**/*', 'views/**/*', '*.js'], browserSync.reload);
});

// 清除所有打包文件
gulp.task('clean', function () {
  return gulp.src(['assets', 'rev'])
    .pipe(clean());
});

// 编译less
gulp.task('less', function () {
  return gulp.src('public/less/main.less')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error);
        this.emit('end');
      }
    }))
    .pipe(less())
    .pipe(autoprefixer({
      browsers: [
        'Explorer >= 8',
        'Firefox >= 30',
        'Chrome >= 36',
        'Safari >= 7',
        'iOS >= 7',
        'Android >= 4'
      ]
    }))
    .pipe(gulp.dest('public/css'))
});

// 打包css
gulp.task('css', function () {
  return gulp.src('public/css/*.css')
    .pipe(csso())
    // .pipe(rev())
    .pipe(gulp.dest(path.css));
    // .pipe(rev.manifest({
    //     path: 'rev-css.json'
    // }))
    // .pipe(gulp.dest('rev'));
});

// 打包js
gulp.task('js', function () {
  return gulp.src('public/js/*.js')
    .pipe(uglify())
    // .pipe(rev())
    .pipe(gulp.dest(path.js));
  // .pipe(rev.manifest({
  //     path: 'rev-js.json'
  // }))
  // .pipe(gulp.dest('rev'));
});

// 打包组件
gulp.task('components', function () {
  gulp.src('public/components/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(path.components));
  gulp.src('public/components/**/*.map')
    .pipe(gulp.dest(path.components));
  gulp.src(['public/components/**/*.jpg', 'public/components/**/*.png', 'public/components/**/*.gif'])
    .pipe(imagemin())
    .pipe(gulp.dest(path.components));
  return gulp.src('public/components/**/*.css')
    .pipe(csso())
    .pipe(gulp.dest(path.components));
});

// 打包images
gulp.task('images', function () {
  return gulp.src('public/images/**')
    .pipe(imagemin())
    .pipe(gulp.dest(path.images));
});

// 文件增量更新重命名
// gulp.task('collector', ['less', 'js', 'components'], function () {
//     return gulp.src(['rev/*.json', 'views/**/*.pug'])
//         .pipe(collector())
//         .pipe(gulp.dest('dist'));
// });

gulp.task('dist', function (cb) {
  runSequence('clean', 'less', ['css', 'js', 'components', 'images'], cb);
});