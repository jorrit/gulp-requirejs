define(['non_md_file', 'simple_amd_file'], function(MyLib, Mult) {

    var SumMulti = function(a, b) {
        return Mult(MyLib.sum(a, b), b);
    }

    return SumMulti;

});