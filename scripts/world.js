define(['pixi', 'Swarm'], function(pixi, Swarm) {

    var world = {
        render: render,
        update: update,
    };

    var app, container;

    var swarm;

    init();

    return world;

    function init() {
        app = new pixi.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x1099bb,
            roundPixels: true,
            resolution: window.devicePixelRatio || 1,
        });
        document.body.appendChild(app.view);

        pixi.SCALE_MODES.DEFAULT = pixi.SCALE_MODES.NEAREST;

        container = new pixi.Container();

        container.scale.x = 4;
        container.scale.y = 4;

        app.stage.addChild(container);

        var texture = pixi.Texture.from('images/grass.png');

        var tilingSprite = new pixi.TilingSprite(
            texture,
            app.screen.width,
            app.screen.height,
        );
        container.addChild(tilingSprite);

        swarm = new Swarm();
        swarm.container.position.x = 12;
        swarm.container.position.y = 12;

        container.addChild(swarm.container);

        var t_flower1 = pixi.Texture.from('images/flower-1.png');
        var flower1 = new pixi.Sprite(t_flower1);
        flower1.position.x = 8;
        flower1.position.y = 8;
        container.addChild(flower1);

        // // Create a new texture
        // var texture = pixi.Texture.from('examples/assets/bunny.png');

        // // Create a 5x5 grid of bunnies
        // for (let i = 0; i < 25; i++) {
        //     var bunny = new pixi.Sprite(texture);
        //     bunny.anchor.set(0.5);
        //     bunny.x = (i % 5) * 40;
        //     bunny.y = Math.floor(i / 5) * 40;
        //     container.addChild(bunny);
        // }

        // // Move container to the center
        // container.x = app.screen.width / 2;
        // container.y = app.screen.height / 2;

        // // Center bunny sprite in local container coordinates
        // container.pivot.x = container.width / 2;
        // container.pivot.y = container.height / 2;
    }

    function render() {
        app.render();
    }

    function update(d) {
        swarm.update(d);
    }

});