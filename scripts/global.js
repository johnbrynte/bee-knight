define(['pixi'], function(pixi) {

    var global = {
        stages: {},
        screenSize: 640,
        spriteSize: 8,
        scale: 8,
        size: 0,

        addStagesToContainer: addStagesToContainer,
    };

    init();

    return global;

    function init() {
        global.size = global.screenSize / (global.scale * global.spriteSize);

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