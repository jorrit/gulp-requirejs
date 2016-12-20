requirejs(['vendor/simple_amd_file'], function(mult) {
  console.log('executing the simple init file');
  console.log(mult(3, 5));
});
