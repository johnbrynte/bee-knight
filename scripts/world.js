define(['pixi', 'global', 'Swarm', 'Player', 'Flower', 'Basket', 'Stage', 'input', 'data'], function(pixi, global, Swarm, Player, Flower, Basket, Stage, input, data) {

    var world = {
        render: render,
        update: update,
    };

    var app, container, stage;

    var bgmusic = new Howl({
        src: ['sounds/beeknight_theme.ogg'],
        loop: true,
    });//.play();

    init();

    return world;

    function init() {
        console.log(data.stages);

        app = new pixi.Application({
            width: global.screenSize,
            height: global.screenSize,
            backgroundColor: 0x1099bb,
            roundPixels: true,
            resolution: window.devicePixelRatio || 1,
        });
        document.getElementById("canvas-container").appendChild(app.view);

        pixi.SCALE_MODES.DEFAULT = pixi.SCALE_MODES.NEAREST;

        // stages
        container = new pixi.Container();

        container.scale.x = global.scale;
        container.scale.y = global.scale;

        app.stage.addChild(container);

        // add stages to container
        global.addStagesToContainer(container);

        // environment
        var texture = pixi.Texture.from('images/grass-1.png');

        var tilingSprite = new pixi.TilingSprite(
            texture,
            app.screen.width,
            app.screen.height,
        );
        global.stages.ground.addChild(tilingSprite);

        stage = new Stage(data.stages[0]);
    }

    function render() {
        app.render();
    }

    function update(d) {
        if (stage) {
            stage.update(d);
        }

        input.update();
    }

});