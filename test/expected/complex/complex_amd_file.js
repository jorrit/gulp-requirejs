define(['non_md_file', 'simple_amd_file'], function(MyLib, mult) {

  var SumMulti = function(a, b) {
    return mult(MyLib.sum(a, b), b);
  };

  return SumMulti;

});
