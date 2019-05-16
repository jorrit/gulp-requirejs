/* eslint-disable max-len */
/* eslint-env mocha */
var grjs = require('../');
var should = require('should');
var fs = require('fs');

require('mocha');

describe('gulp-requirejs', function() {
  it('should emit end when stream is done', function(done) {
    var stream = grjs({
      out: 'simple_init.js',

      baseUrl: 'test/fixtures/',

      findNestedDependencies: true,
      skipPragmas: true,

      name: 'simple_init',

      include: ['simple_init'],

      create: true
    });

    stream.on('end', done);
  });

  it('should emit source map file when configured', function(done) {
    var stream = grjs({
      out: 'simple_init.js',

      baseUrl: 'test/fixtures/',

      findNestedDependencies: true,
      skipPragmas: true,
      generateSourceMaps: true,

      name: 'simple_init',

      include: ['simple_init'],

      create: true
    });

    stream.on('data', function(output) {
      try {
        output.path.should.equal('simple_init.js');
        output.should.have.property('sourceMap');
        output.sourceMap.should.be.Object();
        output.sourceMap.sources.should.containEql('vendor/simple_amd_file.js');
        output.sourceMap.sources.should.containEql('simple_init.js');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('simple AMD file', function() {

    it('should concat the files in the correct order', function(done) {
      var stream = grjs({
        out: 'simple_init.js',

        baseUrl: 'test/fixtures/',

        findNestedDependencies: true,
        skipPragmas: true,

        name: 'simple_init',

        include: ['simple_init'],

        create: true
      });

      stream.on('data', function(output) {
        try {
          should.exist(output);
          should.exist(output.path);
          should.exist(output.relative);
          should.exist(output.contents);
          should.exist(output.buildResponse);

          output.relative.should.equal('simple_init.js');
          String(output.contents).should.equal(fs.readFileSync('test/expected/simple_init.js', 'utf8'));
          output.buildResponse.should.match(/simple_init\.js[\s\S]*simple_amd_file\.js[\s\S]*simple_init\.js/m);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

  });

  describe('AMD und UMD mix', function() {

    it('should concat the files in the correct order', function(done) {
      var stream = grjs({
        out: 'umd_init.js',

        baseUrl: 'test/fixtures/',

        findNestedDependencies: true,
        skipPragmas: true,

        name: 'umd_init',

        include: ['umd_init'],

        create: true
      });

      stream.on('data', function(output) {
        try {
          should.exist(output);
          should.exist(output.path);
          should.exist(output.relative);
          should.exist(output.contents);

          output.relative.should.equal('umd_init.js');
          String(output.contents).should.equal(fs.readFileSync('test/expected/umd_init.js', 'utf8'));
          done();
        } catch (e) {
          done(e);
        }
      });
    });

  });

  describe('amd file with shim', function() {
    it('should concat the files in the correct order, and build wrappers for the shimmed files', function(done) {
      var stream = grjs({
        out: 'complex_init.js',

        baseUrl: 'test/fixtures/vendor',

        findNestedDependencies: true,
        skipPragmas: true,

        name: '../complex_init',

        include: ['../complex_init'],

        create: true,

        shim: {
          'non_md_file': {
            exports: 'myLib'
          }
        }
      });

      stream.on('data', function(output) {
        try {
          should.exist(output);
          should.exist(output.path);
          should.exist(output.relative);
          should.exist(output.contents);

          output.relative.should.equal('complex_init.js');
          String(output.contents).should.equal(fs.readFileSync('test/expected/complex_init.js', 'utf8'));
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('amd dir with shim', function() {
    var pathname = 'test/tmp/';
    var moduleName = 'complex_init_dir';
    it('should concat the files in the correct order into modules.name, and build wrappers for the shimmed files', function(done) {
      grjs({
        mainConfigFile: 'test/fixtures/config_init_dir.js',
        dir: pathname,
        path: {
          'config': '../config_init_dir'
        },
        modules: [{
          name: moduleName, // no extension
          includes: [
            'simple_amd_file',
            'umd_file',
            'complex_amd_file',
            'non_md_file'
          ]
        }],
        enforceDefine: true,
        baseUrl: 'test/fixtures/vendor',
        optimize: 'none',
        findNestedDependencies: true
      });
      var contents = fs.readFileSync( 'test/expected/complex/' + moduleName + '.js', 'utf8');
      var length = contents.length;
      // wait, as require.js deletes and copies files
      setTimeout(function(){
        var test = fs.readFileSync( pathname + moduleName + '.js', 'utf8');
        test.length.should.equal(length);
        test.should.equal(contents);
        done();
      }, 1);
    });
    /*after(function() {
      var files = require('glob').globSync(pathname + '*');
      files.foreach( fs.unlink );
    });*/
  });

  describe('ERRORS: ', function() {

    it('should throw an error if we forget to pass in an options object', function(done) {

      (function() {
        grjs();
      }).should.throwError(/^Miss.*/);

      done();
    });

    it('should throw an error if we forget to set the baseUrl', function(done) {

      (function() {
        grjs({
          out: 'test.js'
        });
      }).should.throwError(/^Pip.*/);

      done();
    });


    it('should throw an error if we forget to set the output (out or dir)', function(done) {

      (function() {
        grjs({
          baseUrl: 'test/dir'
        });
      }).should.throwError(/^Either.*/);

      done();
    });

    it('should emit an error event when the require.js optimizer finds an error', function(done) {

      var stream = grjs({
        baseUrl: 'test/dir',
        out: 'testURL'
      });

      stream.on('error', function() {
        done();
      });

    });

  });

});
