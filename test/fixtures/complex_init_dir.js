requirejs(['simple_amd_file', 'umd_file', 'complex_amd_file'],
  function(mult, UMDLib, sumMulti) {
    console.log('executing the COMPLEX init file');
    console.log(mult(3, 5), '<= this should be 15');
    UMDLib.test(); // should log 'Test Log from the UMD file'
    console.log(sumMulti(5, 8), '<= this should be 104');
  }
);
