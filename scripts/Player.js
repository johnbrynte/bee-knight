define(['pixi', 'utils', 'input', 'Flower'], function(pixi, utils, input, Flower) {

    var world;

    require(['world'], function(_world) {
        world = _world;
    });

    return Player;

    function Player(x, y) {
        var that = this;

        this.graphics = new pixi.Container();
        this.graphics.position.x = x;
        this.graphics.position.y = y;

        var g;
        var t_player = pixi.Texture.from('images/player.png');
        g = new pixi.Sprite(t_player);
        g.pivot.x = 4;
        g.pivot.y = 4;
        g.visible = false;
        var g_player = g;
        this.graphics.addChild(g_player);

        let t_player_steps = [];
        ["player_step_1", "player_step_2", "player_step_3"]
            .forEach(function(img) {
                var texture = pixi.Texture.from("images/" + img + ".png");
                t_player_steps.push(texture);
            });
        g = new pixi.extras.AnimatedSprite(t_player_steps);
        g.animationSpeed = 0.1;
        g.play();
        g.pivot.x = 4;
        g.pivot.y = 4;
        g.visible = false;
        var g_player_step = g;
        this.graphics.addChild(g_player_step);

        this.pos = new pixi.Point(x, y);
        this.acc = 300;
        this.decc = 50;
        this.speed = new pixi.Point(0, 0);
        this.max_speed = 50;

        this.update = function(dt) {
            that.updateMovement(dt);

            that.updateInteraction(dt);
        };

        this.updateInteraction = function(dt) {
            if (input.keypressed.ACTION) {
                if (!that.holding) {
                    Flower.flowers.forEach(function(flower) {
                        if (!that.holding && flower.planted && utils.distance(that.pos, flower.pos) <= 6) {
                            that.holding = flower;
                            flower.planted = false;

                            that.graphics.addChild(flower.graphics);

                            flower.setPos(0, 0, that);
                        }
                    });
                } else {
                    var flower = that.holding;
                    flower.planted = true;
                    world.stages.ground.addChild(flower.graphics);
                    flower.setPos((that.pos.x | 0), (that.pos.y | 0));

                    that.holding = null;
                }
            }
        };

        this.updateMovement = function(dt) {
            var dx = 0, dy = 0;

            if (input.keydown.LEFT) {
                dx = -1;
            }
            if (input.keydown.RIGHT) {
                dx = 1;
            }
            if (input.keydown.UP) {
                dy = -1;
            }
            if (input.keydown.DOWN) {
                dy = 1;
            }

            // x
            if (dx != 0) {
                that.speed.x += dx * that.acc * dt;

                if (Math.abs(that.speed.x) > that.max_speed) {
                    that.speed.x += ((that.speed.x < 0 ? -that.max_speed : that.max_speed) - that.speed.x) * that.acc * dt;
                }
            } else {
                that.speed.x += (0 - that.speed.x) * that.decc * dt;

                // if (Math.abs(that.speed.x) > that.max_speed) {
                //     that.speed.x = that.speed.x < 0 ? -that.max_speed : that.max_speed;
                // }
            }

            // y
            if (dy != 0) {
                that.speed.y += dy * that.acc * dt;

                if (Math.abs(that.speed.y) > that.max_speed) {
                    that.speed.y += ((that.speed.y < 0 ? -that.max_speed : that.max_speed) - that.speed.y) * that.acc * dt;
                }
            } else {
                that.speed.y += (0 - that.speed.y) * that.decc * dt;
            }

            that.pos.x += that.speed.x * dt;
            that.pos.y += that.speed.y * dt;

            var tx = that.pos.x | 0;
            var ty = that.pos.y | 0;

            if (that.holding) {
                that.holding.setPos(0, 0, that);
            }

            that.graphics.position.x += (tx - that.graphics.position.x) * 20 * dt;
            that.graphics.position.y += (ty - that.graphics.position.y) * 20 * dt;

            that.graphics.scale.x = dx < 0 ? -1 : 1;

            if (dx != 0 || dy != 0) {
                g_player.visible = false;
                g_player_step.visible = true;

                if (input.keypressed.LEFT || input.keypressed.RIGHT) {
                    g_player_step.gotoAndPlay(0);
                }
            } else {
                g_player.visible = true;
                g_player_step.visible = false;
            }
        }
    }

});