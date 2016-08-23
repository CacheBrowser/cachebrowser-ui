'use strict';

var pathUtil = require('path');
var Q = require('q');
var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var jetpack = require('fs-jetpack');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');

var utils = require('./utils');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');


var paths = {
    copyFromAppDir: [
        './node_modules/**',
        './lib/**',
        './**/*.html',
        './**/*.+(jpg|png|svg)',
        './fonts/**'
    ]
};


gulp.task('clean', function () {
    return destDir.dirAsync('.', { empty: true });
});


gulp.task('copy', function () {
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true,
        matching: paths.copyFromAppDir
    });
});


gulp.task('lint', function() {
    const ignore = ['!app/{lib,lib/**}', '!app/{node_modules,node_modules/**}'];
    return gulp.src([srcDir.path('**/*.js')].concat(ignore))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


gulp.task("babel", function () {
    var babelIgnore = ['!app/{lib,lib/**}', '!app/{node_modules,node_modules/**}'];
    return gulp.src([srcDir.path('**/*.js')].concat(babelIgnore))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(destDir.path('.')));
});


gulp.task('sass', function () {
    return gulp.src('stylesheets/main.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(plumber())
        .pipe(gulp.dest(destDir.path('stylesheets')));
});


gulp.task('views', function () {
    return gulp.src(srcDir.path('**/*.jade'))
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(destDir.path('.')))
});


gulp.task('environment', function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'), {overwrite: true});
});


gulp.task('package-json', function () {
    var manifest = srcDir.read('package.json', 'json');

    // Add "dev" suffix to name, so Electron will write all data like cookies
    // and localStorage in separate places for production and development.
    if (utils.getEnvName() === 'development') {
        manifest.name += '-dev';
        manifest.productName += ' Dev';
    }

    destDir.write('package.json', manifest, {overwrite: true});
});


gulp.task('watch', function () {
    watch(paths.copyFromAppDir, { cwd: 'app' }, batch(function (events, done) {
        gulp.start('copy', done);
    }));
    watch('app/**/*.js', batch(function (events, done) {
        gulp.start('babel', done);
    }));
    watch('app/**/*.scss', batch(function (events, done) {
        gulp.start('sass', done);
    }));
    watch('app/**/*.jade', batch(function (events, done) {
        gulp.start('views', done);
    }));
});


gulp.task('build', ['lint', 'babel', 'sass', 'views', 'copy', 'environment', 'package-json']);
