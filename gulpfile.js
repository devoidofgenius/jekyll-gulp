// =====================================
// Required
// =====================================

var gulp          = require('gulp'),
    browserSync   = require('browser-sync'),
    reload        = browserSync.reload,
    uglify        = require('gulp-uglify'),
    sass          = require('gulp-sass'),
    plumber       = require('gulp-plumber'),
    autoprefixer  = require('gulp-autoprefixer'),
    rename        = require('gulp-rename'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    cp            = require('child_process');


// =====================================
// Jekyll Task
// =====================================

// Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

// Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

// =====================================
// Browser-Sync Task
// =====================================

gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
      server:{
        baseDir: "_site"
      }
    });
});

// =====================================
// Sass Tasks
// =====================================

gulp.task('sass', function() {
  gulp.src('assets/css/main.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(reload({stream:true}))
    .pipe(gulp.dest('assets/css'));
});

// =====================================
// Scripts
// =====================================

gulp.task('scripts', function() {
  gulp.src(['assets/js/**/*.js', '!assets/js/**/*.min.js'])
    .pipe(plumber())
    .pipe(rename({suffix:'.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(reload({stream:true}))
    .pipe(gulp.dest('assets/js'));
});

// =====================================
// Imagemin Task
// =====================================

gulp.task('images', function () {
  gulp.src('assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('_site/assets/img'))
    .pipe(reload({stream:true}));
});

// =====================================
// Watch Tasks
// =====================================

gulp.task('watch', function() {
  gulp.watch('assets/css/**', ['sass']);
  gulp.watch('assets/js/**', ['scripts']);
  gulp.watch('assets/img/**', ['images']);
  gulp.watch(['index.html', '_includes/*' , '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

// =====================================
// Default Task
// =====================================

gulp.task('default', ['sass', 'images', 'scripts','browser-sync', 'watch']);
