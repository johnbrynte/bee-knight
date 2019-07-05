define(['pixi', 'global', 'Swarm', 'Player', 'Flower', 'input'], function(pixi, global, Swarm, Player, Flower, input) {

    var world = {
        render: render,
        update: update,
    };

    var app, container;

    var player;

    var bgmusic = new Howl({
        src: ['sounds/beeknight_theme.ogg'],
        loop: true,
    });//.play();

    init();

    return world;

    function init() {
        app = new pixi.Application({
            width: global.screenSize,
            height: global.screenSize,
            backgroundColor: 0x1099bb,
            roundPixels: true,
            resolution: window.devicePixelRatio || 1,
        });
        document.body.appendChild(app.view);

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

        // objects
        // for (var i = 0; i < 3; i++) {
        //     var flower = new Flower((Math.random() * global.size | 0) * 8 + 4, (Math.random() * global.size | 0) * 8 + 4);
        //     global.stages.ground.addChild(flower.graphics);
        // }

        var flowerA = new Flower(
            8 * 2 + 4, 8 * 4 + 4,
            'flower-2', Flower.A);
        global.stages.ground.addChild(flowerA.graphics);

        var flowerB = new Flower(
            8 * 3 + 4, 8 * 4 + 4,
            'flower-2', Flower.B);
        global.stages.ground.addChild(flowerB.graphics);

        var swarm = new Swarm(8 * 3 + 4, 8 * 3 + 4, 4);
        global.stages.air.addChild(swarm.container);

        // for (var i = 0; i < 1; i++) {
        //     var swarm = new Swarm((Math.random() * global.size | 0) * 8 + 4, (Math.random() * global.size | 0) * 8 + 4, 4);
        //     global.stages.air.addChild(swarm.container);
        // }

        player = new Player(8, 8);
        global.stages.player.addChild(player.graphics);
    }

    function render() {
        app.render();
    }

    function update(d) {
        player.update(d);

        Swarm.swarms.forEach(function(swarm) {
            swarm.update(d);
        });

        Flower.flowers.forEach(function(flower) {
            flower.update(d);
        });

        input.update();
    }

});