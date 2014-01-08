// src for the wrapper: https://github.com/umdjs/umd/blob/master/amdWeb.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
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