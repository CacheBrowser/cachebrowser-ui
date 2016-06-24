'use strict';

var pathUtil = require('path');
var Q = require('q');
var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var sass = require('gulp-ruby-sass');
var pug = require('gulp-pug');
var jetpack = require('fs-jetpack');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');

var utils = require('../utils');

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

// -------------------------------------
// Tasks
// -------------------------------------


gulp.task('clean', function () {
    return destDir.dirAsync('.', { empty: true });
});


var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
            overwrite: true,
            matching: paths.copyFromAppDir
        });
};
gulp.task('copy', copyTask);
gulp.task('copy-watch', copyTask);


var babelTask = function () {
    var babelIgnore = ['!app/{lib,lib/**}', '!app/{node_modules,node_modules/**}']
    return gulp.src([srcDir.path('**/*.js')].concat(babelIgnore))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(destDir.path('.')));
}
gulp.task("babel", babelTask);
gulp.task('babel-watch', babelTask);

var sassTask = function () {
    return sass(srcDir.path('stylesheets/main.scss'), { style: 'expanded' })
        .pipe(plumber())
        .pipe(gulp.dest(destDir.path('stylesheets')));
};
gulp.task('sass', sassTask);
gulp.task('sass-watch', sassTask);

var viewsTask = function () {
    return gulp.src(srcDir.path('**/*.jade'))
    .pipe(plumber())
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(destDir.path('.')))
};
gulp.task('views', viewsTask);
gulp.task('views-watch', viewsTask);


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
        gulp.start('copy-watch', done);
    }));
    watch('app/**/*.js', batch(function (events, done) {
        gulp.start('babel-watch', done);
    }));
    watch('app/**/*.scss', batch(function (events, done) {
        gulp.start('sass-watch', done);
    }));
    watch('app/**/*.jade', batch(function (events, done) {
        gulp.start('views-watch', done);
    }));
});


gulp.task('build', ['babel', 'sass', 'views', 'copy', 'environment', 'package-json']);
