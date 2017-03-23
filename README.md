# gulp-requirejs

[![gulp-requirejs on npm](https://img.shields.io/npm/v/gulp-requirejs.svg?style=flat)](https://www.npmjs.com/package/gulp-requirejs)
[![Dependency Status](https://david-dm.org/jorrit/gulp-requirejs.png)](https://david-dm.org/jorrit/gulp-requirejs)
[![Build Status](https://travis-ci.org/jorrit/gulp-requirejs.png?branch=master)](https://travis-ci.org/jorrit/gulp-requirejs)
[![Coverage](https://coveralls.io/repos/github/jorrit/gulp-requirejs/badge.svg)](https://coveralls.io/github/jorrit/gulp-requirejs)

## Information

A small, simple, very easy wrapper around the [require.js optimizer](https://github.com/jrburke/r.js) to work with [gulp.js](https://github.com/gulpjs/gulp)

<table>
<tr>
<td>Package</td><td>gulp-requirejs</td>
</tr>
<tr>
<td>Description</td>
<td>uses require.js's r.js optimizer to combine require.js AMD modules into one file</td>
</tr>
<tr>
<td>Node Version</td>
<td>≧ 4</td>
</tr>
</table>


## Installation

Simply add `gulp-requirejs` as a dev-dependency in your package.json or run

```bash
$ npm install --save-dev gulp-requirejs
```

## Usage

Because the require.js optimizer (_r.js_) is a kind of build system in itself we can't use the `gulp.src([...])` syntax at the moment (I might add this in future), instead this wrapper itself emits a pipable stream, holding a 'virtual' file, in which the result of the r.js build process are saved.

The resulting stream can be treated like a regular `gulp.src(...)` stream.

>NOTE: The built in minification/obfuscation is deactivated by default. It is recommended to use a gulp plugin like gulp-uglify for minification, but you can enable r.js minification by setting the `optimize` option to `uglify` to minify using r.js.

```javascript
var gulp = require('gulp'),
    rjs = require('gulp-requirejs');

gulp.task('requirejsBuild', function() {
    return rjs({
        baseUrl: 'path/to/your/base/file.js',
        out: 'FILENAME_TO_BE_OUTPUTTED',
        shim: {
            // standard require.js shim options
        },
        // ... more require.js options
    })
    .pipe(gulp.dest('./deploy/')); // pipe it to the output DIR
});
```

Note: In order to let gulp know that the optimization completes, return the rjs stream.

### Error handling

gulp-requirejs will emit errors when you don't pass an options object, if the `baseUrl` or `out` properties are undefined or when the requirejs optimizer detects an error.

### Source maps

When source maps are enabled via the r.js `generateSourceMaps` option the file in the stream `rjs()` contains a `sourceMap` property with the sourcemap as an object.

Use [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) to process this object in your gulp configuration.

```javascript
var gulp = require('gulp'),
    rjs = require('gulp-requirejs')
    sourcemaps = require('gulp-sourcemaps');

gulp.task('requirejsBuild', function() {
    return rjs({
        baseUrl: 'path/to/your/base/file.js',
        out: 'FILENAME_TO_BE_OUTPUTTED',
        generateSourceMaps: true,
        shim: {
            // standard require.js shim options
        },
        // ... more require.js options
    })
    .pipe(sourcemaps.init({loadMaps: true})) // initialize gulp-sourcemaps with the existing map
    .pipe(sourcemaps.write()) // write the source maps
    .pipe(gulp.dest('./deploy/')); // pipe it to the output DIR
});
```

## Options

The options object supports the same parameters as the [require.js optimizer](https://github.com/jrburke/r.js).
