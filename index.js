var requirejs = require('requirejs');
var PluginError = require('plugin-error');
var Vinyl = require('vinyl');
var es = require('event-stream');

// Consts
var PLUGIN_NAME = 'gulp-requirejs';

function validateOptions(opts) {
  if (!opts) {
    throw new PluginError(PLUGIN_NAME, 'Missing options object.');
  }

  if ( !opts.out && typeof opts.out !== 'string'
    && !opts.dir && typeof opts.dir !== 'string' ) {
    throw new PluginError(PLUGIN_NAME, 'Either single file outputs are ' +
      'supported right now, please pass a valid output file name as the out ' +
      'option.');
  }

  if (!opts.baseUrl) {
    throw new PluginError(PLUGIN_NAME, 'Pipeing dirs/files is not ' +
      'supported right now, please specify the base path for your script as ' +
      'the baseUrl option.');
  }
}

function createFile(filename, output, buildResponse, sourceMap) {
  var newFile = new Vinyl({
    path: filename,
    contents: Buffer.from(output)
  });
  // Add a string containing the list of added dependencies for
  // debugging purposes.
  newFile.buildResponse = buildResponse.replace('FUNCTION', filename);
  if (sourceMap) {
    newFile.sourceMap = JSON.parse(sourceMap);
  }
  return newFile;
}

module.exports = function(opts) {
  'use strict';

  validateOptions(opts);

  // Disable optimization by default.
  opts.optimize = opts.optimize || 'none';

  // create the stream and save the file name
  // (opts.out will be replaced by a callback function later)
  var stream = es.pause();
  var filename = opts.out || opts.dir;
  var output = null;
  var sourceMapOutput = null;

  // Set .out to a function to catch result text and sourcemap.
  if (opts.out) {
    opts.out = function(text, sourceMap) {
      output = text;
      sourceMapOutput = sourceMap;
    };
  }

  var success = function(buildResponse) {
    if (output) {
      stream.write(
        createFile(filename, output, buildResponse, sourceMapOutput)
      );
    }
    stream.resume();
    stream.end();
  };
  var error = function(error) {
    stream.emit('error', new PluginError(PLUGIN_NAME, error));
  };

  // just a small wrapper around the r.js optimizer, we write a new gutil.File
  // (vinyl) to the Stream, mocking a file, which can be handled
  // regular gulp plugins.
  requirejs.optimize(opts, success, error);

  // return the stream for chain .pipe()ing
  return stream;
};
