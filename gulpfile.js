// very simple compiler

var gulp = require('gulp');
var gutil = require('gulp-util');
var chmod = require('gulp-chmod');
var eol = require('gulp-eol');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var watchify = require('watchify');
var assign = require('lodash.assign');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

function buildScript (options) {
    var browserifyOpts = {
        entries: [options.entry],
        debug: true
    };
    if (options.watch)
        browserifyOpts = assign({}, watchify.args, browserifyOpts);
    var bundler = browserify(browserifyOpts);
    if (options.watch)
        bundler = watchify(bundler);

    function rebundle () {
        var p = bundler.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source(options.output))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}));
        if (options.uglify)
            p = p.pipe(uglify());
        return p
            .pipe(sourcemaps.write("."))
            .pipe(chmod(644))
            .pipe(eol("\n"))
            .pipe(gulp.dest("dst"));
    }

    bundler.on('log', gutil.log);
    bundler.on('update', rebundle);
    return rebundle();
}

function watched(opts) {
    return assign({}, opts, {watch: true});
}

function uglified(opts) {
    var output = opts.output.replace(/.js$/, '.min.js');
    return assign({}, opts, {uglify: true, output: output});
}

var mainScriptOpts = {
    entry: 'src/main.js',
    output: 'drag-and-drop.js',
    watch: false,
    uglify: true
};

gulp.task('build', gulp.series(function (done) {
    buildScript(mainScriptOpts);
    done();
}));

gulp.task('build_min', gulp.series(function (done) {
    buildScript(uglified(mainScriptOpts))
    done();
}));

gulp.task('watch', gulp.series(function (done) {
    buildScript(watched(mainScriptOpts));
    done();
}));

gulp.task('lint', gulp.series(function(done) {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
    done();
}));

gulp.task('default', gulp.series('build'));
