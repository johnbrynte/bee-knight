define(['pixi', 'global', 'Swarm', 'Player', 'Flower', 'Basket', 'Stage', 'input', 'data'], function(pixi, global, Swarm, Player, Flower, Basket, Stage, input, data) {

    var world = {
        render: render,
        update: update,
        reset: reset,
    };

    var app, container, stage;

    var bgmusic = new Howl({
        src: ['sounds/beeknight_theme.ogg'],
        loop: true,
    }).play();

    var stageCurrent = 0;
    var stageDone = false;
    var gameDone = false;

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

        loadStage(stageCurrent);
    }

    function loadStage(index) {
        if (stage) {
            stage.destroy();
        }
        gameDone = false;
        stageDone = false;
        stage = new Stage(data.stages[index]);
        stage.onFinish.add(onFinish);
    }

    function onFinish() {
        stageDone = true;
    }

    function reset() {
        if (stage) {
            stage.destroy();
            stage = null;
        }
        setTimeout(function() {
            loadStage(stageCurrent);
        }, 500);
    }

    function render() {
        app.render();
    }

    function update(d) {
        if (gameDone) {
            return;
        }

        if (stageDone) {
            if (input.keypressed.ACTION || input.keypressed.START) {
                if (stageCurrent < data.stages.length - 1) {
                    stageCurrent += 1;
                    loadStage(stageCurrent);
                } else {
                    gameDone = true;
                    var m_finish = document.getElementById("message-finish");
                    m_finish.style.opacity = 1;
                }
            }
        }

        if (stage) {
            stage.update(d);
        }

        input.update();
    }

});