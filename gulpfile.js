const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');

gulp.task('sass', function() {
    return gulp.src('src/scss/main.scss')
            .pipe(sass())
            .pipe(gulp.dest('assets'))
});

gulp.task('scripts', function() {
    return gulp.src(['src/js/vendor/*.js','src/js/scripts/*.js'])
      .pipe(concat('main.js'))
      .pipe(gulp.dest('assets'))
  });

gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
	gulp.watch(['src/js/vendor/*.js','src/js/scripts/*.js'], gulp.series('scripts'));
})