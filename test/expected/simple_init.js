define('vendor/simple_amd_file',[],function() {

  var Mult = function(a, b) {
    return a * b;
  };

  return Mult;

});

requirejs(['vendor/simple_amd_file'], function(mult) {
  console.log('executing the simple init file');
  console.log(mult(3, 5));
});

define("simple_init", function(){});


define("simple_init", function(){});
