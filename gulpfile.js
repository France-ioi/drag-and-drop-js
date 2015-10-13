// very simple compiler

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

gulp.task('build', function() {
  return gulp.src(['src/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('drag-and-drop.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dst'));
});

gulp.task('default', ['build']);