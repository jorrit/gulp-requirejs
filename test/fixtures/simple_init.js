requirejs(['vendor/simple_amd_file'], function(Mult) {
    console.log("executing the simple init file");
    console.log(Mult(3, 5));
});