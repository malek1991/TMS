var gulp = require('gulp');
var gutil = require('gulp-util');
var ui5preload = require('gulp-ui5-preload');
var gulpIgnore = require('gulp-ignore');
var uglify = require('gulp-uglify');
var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');

gulp.task(
    'ui5preload',
    function() {
        return gulp.src(
            [
                '**/**.+(js|xml)',
                '!**/Component-preload.js',
                '!gulpfile.js',
                '!WEB-INF/web.xml',
                '!model/metadata.xml',
                '!node_modules/**',
                '!resources/**'
            ]
        ).pipe(gulpIgnore.exclude('**/gridstack.all.js'))
            .pipe(gulpif('**/*.js', uglify()).on('error', gutil.log))
                    .pipe(gulpif('**/*.xml', prettydata({type: 'minify'})).on('error', gutil.log))
                    .pipe(ui5preload({
                        base: './',
                        namespace: 'vistex.tms',
                        fileName: 'Component-preload.js'
                    }).on('error', gutil.log))
                    .pipe(gulp.dest('./').on('error', gutil.log));
    }
)
