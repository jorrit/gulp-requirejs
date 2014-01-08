
define('simple_amd_file',[],function() {

    var Mult = function(a, b) {
        return a * b;
    }

    return Mult;

});
// src for the wrapper: https://github.com/umdjs/umd/blob/master/amdWeb.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('umd_file',factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function() {
    //use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {
        test: function() {
            console.log('Test Log from the UMD file');
        }
    };
}));
(function(root) {

    root.myLib = {};

    myLib.sum = function(a, b) {
        return a + b;
    } // END PROTYPE OF sum

})(this);
define("non_md_file", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.myLib;
    };
}(this)));

define('complex_amd_file',['non_md_file', 'simple_amd_file'], function(MyLib, Mult) {

    var SumMulti = function(a, b) {
        return Mult(MyLib.sum(a, b), b);
    }

    return SumMulti;

});
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
define("../complex_init", function(){});

define("../complex_init", function(){});
