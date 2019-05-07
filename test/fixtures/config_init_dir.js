//The build will inline common dependencies into this file.
requirejs.config({
  paths: {
    'complex_init_dir': '../complex_init_dir',
  },
  shim: {
    'non_md_file': {
      exports: 'myLib'
    }
  }
});
