
define('vendor/simple_amd_file',[],function() {

    var Mult = function(a, b) {
        return a * b;
    }

    return Mult;

});
// src for the wrapper: https://github.com/umdjs/umd/blob/master/amdWeb.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('vendor/umd_file',factory);
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
requirejs(['vendor/simple_amd_file', 'vendor/umd_file'], function(Mult, UMDLib) {
    console.log("executing the UMD+AMD init file");
    console.log(Mult(3, 5));
    UMDLib.test(); // should log 'Test Log from the UMD file'
});
define("umd_init", function(){});

define("umd_init", function(){});
