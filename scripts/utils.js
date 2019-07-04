define([], function() {

    var utils = {
        distance: distance,
    };

    return utils;

    function distance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

});