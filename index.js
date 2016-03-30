var gutil       = require('gulp-util'),
    requirejs   = require('requirejs'),
    PluginError = gutil.PluginError,
    File        = gutil.File,
    es          = require('event-stream'),
    fs          = require("fs");

// Consts
const PLUGIN_NAME = 'gulp-requirejs';


module.exports = function(opts) {

    'use strict';

    if (!opts) {
        throw new PluginError(PLUGIN_NAME, 'Missing options array!');
    }

    if (!opts.out && typeof opts.out !== 'string') {
        throw new PluginError(PLUGIN_NAME, 'Only single file outputs are supported right now, please pass a valid output file name!');
    }

    if (!opts.baseUrl) {
        throw new PluginError(PLUGIN_NAME, 'Pipeing dirs/files is not supported right now, please specify the base path for your script.');
    }

    // create the stream and save the file name (opts.out will be replaced by a callback function later)
    var _s     = es.pause(),
        _fName = opts.out;

    // just a small wrapper around the r.js optimizer, we write a new gutil.File (vinyl) to the Stream, mocking a file, which can be handled
    // regular gulp plugins (i hope...).

    optimize(opts, function(text, buildText) {
        var newFile = new File({
            path: _fName,
            contents: new Buffer(text)
        });
        newFile.buildResponse = buildText;
        _s.write(newFile);
    });



    // return the stream for chain .pipe()ing
    return _s;
}

// a small wrapper around the r.js optimizer
function optimize(opts, cb) {
    var scriptName = opts.out,
        buildResponse = false;

    var callbackIfBuildResponse = function(text) {
        if(buildResponse) {
            cb(text, buildResponse);
        } else {
            process.nextTick(function() {
                callbackIfBuildResponse(text);
            })
        }
    }
    opts.out = callbackIfBuildResponse;
    opts.optimize = 'none';
    requirejs.optimize(opts, function(br) {
        if(br) {
            buildResponse = br.replace("FUNCTION", scriptName);
        }
    }, function(err) {
        if(err) {
            buildResponse = "error";
        }
    });
}