var gulp = require('gulp'),
    babel = require('gulp-babel'),
    notice = require('gulp-notice');

gulp.task('default', function () {
    return gulp.src('src/*.js')
        .pipe(babel())
        .pipe(notice())
        .pipe(gulp.dest('dist'));
})
