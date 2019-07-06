define(['pixi', 'global', 'utils', 'Swarm', 'Player', 'Flower', 'Basket', 'Reset', 'input'], function(pixi, global, utils, Swarm, Player, Flower, Basket, Reset, input) {

    return Stage;

    function Stage(data) {
        var that = this;

        // variables

        this.running = true;
        this.onFinish = new utils.Listener();

        // fixed stuff

        var player = new Player(8 + 4, 8 + 4);
        global.stages.player.addChild(player.graphics);

        var t_beehive = pixi.Texture.from('images/bee-hive.png');
        var g_beehive = new pixi.Sprite(t_beehive);
        g_beehive.position.x = global.home.x;
        g_beehive.position.y = global.home.y;
        g_beehive.pivot.x = 4;
        g_beehive.pivot.y = 4;
        global.stages.ground.addChild(g_beehive);

        var basket = new Basket(global.basket.x, global.basket.y);
        basket.onItem.add(onAddItem);
        global.stages.ground.addChild(basket.graphics);

        var reset = new Reset((global.size - 1) * 8 + 4, (global.size - 1) * 8 + 4);
        global.stages.ground.addChild(reset.graphics);

        var m_success = document.getElementById("message-success");
        m_success.style.opacity = 0;

        var m_condition = document.getElementById("game-condition");
        m_condition.innerHTML = data.condition;

        // stage data

        var swarmSize = data.swarmSize || 4;
        for (var i = 0; i < swarmSize; i++) {
            var swarm = new Swarm(global.home.x + 16, global.home.y - 16, 4);
            global.stages.air.addChild(swarm.container);
        }

        if (data.bag) {
            var flowerList = data.bag.map(function(type) {
                return new Flower(0, 0, type);
            });
            player.bag.fill(flowerList, data.bagSize);
        } else {
            player.bag.fill([], data.bagSize);
        }

        if (data.map) {
            for (var y = 0; y < data.map.length; y++) {
                for (var x = 0; x < data.map[0].length; x++) {
                    if (data.map[y][x]) {
                        var flower = new Flower((x + 1) * 8 + 4, (y + 1) * 8 + 4, data.map[y][x]);
                        flower.planted = true;
                        global.stages.ground.addChild(flower.graphics);
                    }
                }
            }
        }

        this.showCustomMessage = false;
        var m_custom = document.getElementById("message-custom");
        var m_custom_text = document.getElementById("message-custom__text");
        m_custom.style.opacity = 0;
        if (data.message) {
            setTimeout(function() {
                this.showCustomMessage = true;
                m_custom_text.innerHTML = data.message;
                m_custom.style.opacity = 1;
            }, 500);
        }

        this.sounds = {
            winning: new Howl({
                src: ['sounds/winning.ogg']
            }),
        };

        function onAddItem(item) {
            m_condition.innerHTML = data.condition - basket.basket.length;

            if (typeof data.condition == "number") {
                if (basket.basket.length >= data.condition) {
                    that.finish();
                    return;
                }
            } else {
                if (data.condition(basket.basket)) {
                    that.finish();
                    return;
                }
            }
        }

        this.finish = function() {
            that.running = false;

            m_success.style.opacity = 1;

            that.sounds.winning.play();

            that.onFinish.emit();
        };

        this.destroy = function() {
            g_beehive.destroy();
            basket.graphics.destroy();

            Swarm.swarms.forEach(function(swarm) {
                swarm.container.destroy();
            });
            Swarm.swarms = [];

            Flower.flowers.forEach(function(flower) {
                flower.graphics.destroy();
            });
            Flower.flowers = [];

            player.graphics.destroy();
            player.bag.graphics.destroy();
        };

        this.update = function(d) {
            Swarm.swarms.forEach(function(swarm) {
                swarm.update(d);
            });

            Flower.flowers.forEach(function(flower) {
                flower.update(d);
            });

            if (that.showCustomMessage) {
                if (input.keypressed.ACTION || input.keypressed.START) {
                    that.showCustomMessage = false;
                    m_custom.style.opacity = 0;
                }
                return;
            }

            if (that.running) {
                player.update(d);
            }

            if (Basket.basket) {
                Basket.basket.update(d);
            }
        };

    }

});