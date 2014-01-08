requirejs(['vendor/simple_amd_file', 'vendor/umd_file'], function(Mult, UMDLib) {
    console.log("executing the UMD+AMD init file");
    console.log(Mult(3, 5));
    UMDLib.test(); // should log 'Test Log from the UMD file'
});