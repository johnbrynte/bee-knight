define(['pixi'], function(pixi) {

    var global = {
        stages: {},
        screenSize: 640,
        spriteSize: 8,
        scale: 8,
        size: 0,
        home: null,
        basket: null,

        addStagesToContainer: addStagesToContainer,
    };

    init();

    return global;

    function init() {
        global.size = global.screenSize / (global.scale * global.spriteSize);

        global.home = new pixi.Point((global.size - 2) * 8 + 4, (1 * 8) + 4);
        global.basket = new pixi.Point((1 * 8) + 4, (global.size - 2) * 8 + 4);

        global.stages.ground = new pixi.Container();
        global.stages.player = new pixi.Container();
        global.stages.air = new pixi.Container();
        global.stages.interface = new pixi.Container();
    }

    function addStagesToContainer(container) {
        for (var key in global.stages) {
            container.addChild(global.stages[key]);
        }
    }

});