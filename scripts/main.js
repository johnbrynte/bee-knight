require.config({
    paths: {
        pixi: '../vendor/pixi-4.5.1.min'
    }
});

require(['timer', 'world'], function(timer, world) {

    timer(render, fixed);

    function render() {
        world.render();
    }

    function fixed() {
        world.update(timer.fixedDeltaTime);
    }

});