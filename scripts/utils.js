define([], function() {

    var utils = {
        distance: distance,
        Listener: Listener,
    };

    return utils;

    function distance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    function Listener() {

        var listeners = [];

        this.add = function(f) {
            listeners.push(f);
        };

        this.emit = function(data) {
            listeners.forEach(function(f) {
                f(data);
            });
        };

    }

});