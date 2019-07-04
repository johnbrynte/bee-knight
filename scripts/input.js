define([], function() {

    var input = {
        keydown: {},
        keypressed: {},

        update: update,
    };

    var keyLookup = {
        32: ['SPACE', 'ACTION'],
        13: ['ENTER', 'START'],
        37: ['LEFT'],
        38: ['UP'],
        39: ['RIGHT'],
        40: ['DOWN'],
        65: ['A', 'LEFT'],
        87: ['W', 'UP'],
        68: ['D', 'RIGHT'],
        83: ['S', 'DOWN'],
    };

    init();

    return input;

    function init() {
        window.addEventListener("keydown", function(evt) {
            var keys = getKeys(evt);

            keys.forEach(function(key) {
                if (!input.keydown[key]) {
                    input.keypressed[key] = true;
                }
                input.keydown[key] = true;
            });
        });

        window.addEventListener("keyup", function(evt) {
            var keys = getKeys(evt);

            keys.forEach(function(key) {
                input.keydown[key] = false;
            });
        });

        window.addEventListener("blur", function() {
            for (var key in input.keydown) {
                input.keydown[key] = false;
            }
        });
    }

    function update() {
        for (var key in input.keypressed) {
            input.keypressed[key] = false;
        }
    }

    function getKeys(evt) {
        if (keyLookup[evt.keyCode]) {
            evt.preventDefault(); // prevent on registered keys
            return keyLookup[evt.keyCode];
        }
        return ['K_' + evt.keyCode];
    }

});