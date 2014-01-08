requirejs.config({
    baseUrl: '/fixtures/vendor',

    shim: {
        'non_md_file': {
            exports: 'myLib'
        }
    }
})

requirejs(['simple_amd_file', 'umd_file', 'complex_amd_file'], function(Mult, UMDLib, SumMulti) {
    console.log("executing the COMPLEX init file");
    console.log(Mult(3, 5), '<= this should be 15');
    UMDLib.test(); // should log 'Test Log from the UMD file'
    console.log(SumMulti(5, 8), '<= this should be 104');
});