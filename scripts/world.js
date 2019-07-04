define(['pixi', 'Swarm', 'Player', 'Flower', 'input'], function(pixi, Swarm, Player, Flower, input) {

    var world = {
        stages: {},
        size: 0,

        render: render,
        update: update,
    };

    var app, container;

    var player;

    var bgmusic = new Howl({
        src: ['sounds/beeknight_theme.ogg'],
        loop: true,
    }).play();

    init();

    return world;

    function init() {
        // setup
        var pixelSize = 640;
        var scale = 8;
        world.size = pixelSize / (scale * 8);

        app = new pixi.Application({
            width: pixelSize,
            height: pixelSize,
            backgroundColor: 0x1099bb,
            roundPixels: true,
            resolution: window.devicePixelRatio || 1,
        });
        document.body.appendChild(app.view);

        pixi.SCALE_MODES.DEFAULT = pixi.SCALE_MODES.NEAREST;

        // stages
        container = new pixi.Container();

        container.scale.x = scale;
        container.scale.y = scale;

        app.stage.addChild(container);

        world.stages.ground = new pixi.Container();
        container.addChild(world.stages.ground);

        world.stages.player = new pixi.Container();
        container.addChild(world.stages.player);

        world.stages.air = new pixi.Container();
        container.addChild(world.stages.air);

        // environment
        var texture = pixi.Texture.from('images/grass-1.png');

        var tilingSprite = new pixi.TilingSprite(
            texture,
            app.screen.width,
            app.screen.height,
        );
        world.stages.ground.addChild(tilingSprite);

        // objects
        for (var i = 0; i < 8; i++) {
            var flower = new Flower((Math.random() * world.size | 0) * 8 + 4, (Math.random() * world.size | 0) * 8 + 4);
            world.stages.ground.addChild(flower.graphics);
        }

        for (var i = 0; i < 4; i++) {
            var swarm = new Swarm((Math.random() * world.size | 0) * 8 + 4, (Math.random() * world.size | 0) * 8 + 4, 4);
            world.stages.air.addChild(swarm.container);
        }

        player = new Player(8, 8);
        world.stages.player.addChild(player.graphics);
    }

    function render() {
        app.render();
    }

    function update(d) {
        player.update(d);

        Swarm.swarms.forEach(function(swarm) {
            swarm.update(d);
        });

        input.update();
    }

});