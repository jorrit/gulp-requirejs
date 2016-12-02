var gutil       = require('gulp-util'),
    requirejs   = require('requirejs'),
    PluginError = gutil.PluginError,
    File        = gutil.File,
    es          = require('event-stream');

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
    var _s       = es.pause(),
        _fName   = opts.out,
        _success = function(text, buildResponse, sourceMap) {
            var newFile = new File({
                path: _fName,
                contents: new Buffer(text)
            });
            // Add a string containing the list of added dependencies for
            // debugging purposes.
            newFile.buildResponse = buildResponse.replace('FUNCTION', _fName);
            if (sourceMap) {
                newFile.sourceMap = JSON.parse(sourceMap);
            }
            _s.write(newFile);
            _s.resume();
            _s.end();
        },
        _error   = function(error) {
            _s.emit('error', new PluginError(PLUGIN_NAME, error));
        };

    // just a small wrapper around the r.js optimizer, we write a new gutil.File (vinyl) to the Stream, mocking a file, which can be handled
    // regular gulp plugins (i hope...).

    optimize(opts, _success, _error);

    // return the stream for chain .pipe()ing
    return _s;
};

// a small wrapper around the r.js optimizer
function optimize(opts, successFn, errorFn) {
    var output = null;
    var sourceMapOutput = null;
    opts.out = function(text, sourceMap) {
        output = text;
        sourceMapOutput = sourceMap;
    }
    opts.optimize = opts.optimize || 'none';
    requirejs.optimize(opts, function(buildResponse) { successFn(output, buildResponse, sourceMapOutput); }, errorFn);
}
