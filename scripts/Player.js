define(['pixi', 'global', 'utils', 'input', 'Flower', 'Bag', 'Basket'], function(pixi, global, utils, input, Flower, Bag, Basket) {

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

        var t_player_hold = pixi.Texture.from('images/player_hold.png');
        g = new pixi.Sprite(t_player_hold);
        g.pivot.x = 4;
        g.pivot.y = 4;
        g.visible = false;
        var g_player_hold = g;
        this.graphics.addChild(g_player_hold);

        let t_player_step = [];
        ["player_step_1", "player_step_2", "player_step_3"]
            .forEach(function(img) {
                var texture = pixi.Texture.from("images/" + img + ".png");
                t_player_step.push(texture);
            });
        g = new pixi.extras.AnimatedSprite(t_player_step);
        g.animationSpeed = 0.1;
        g.play();
        g.pivot.x = 4;
        g.pivot.y = 4;
        g.visible = false;
        var g_player_step = g;
        this.graphics.addChild(g_player_step);

        let t_player_pull = [];
        ["player_pull_1", "player_pull_2"]
            .forEach(function(img) {
                var texture = pixi.Texture.from("images/" + img + ".png");
                t_player_pull.push(texture);
            });
        g = new pixi.extras.AnimatedSprite(t_player_pull);
        g.animationSpeed = 0.1;
        g.play();
        g.pivot.x = 4;
        g.pivot.y = 4;
        g.visible = false;
        var g_player_pull = g;
        this.graphics.addChild(g_player_pull);

        let t_player_step_hold = [];
        ["player_step_hold_1", "player_step_hold_2", "player_step_hold_3"]
            .forEach(function(img) {
                var texture = pixi.Texture.from("images/" + img + ".png");
                t_player_step_hold.push(texture);
            });
        g = new pixi.extras.AnimatedSprite(t_player_step_hold);
        g.animationSpeed = 0.1;
        g.play();
        g.pivot.x = 4;
        g.pivot.y = 4;
        g.visible = false;
        var g_player_step_hold = g;
        this.graphics.addChild(g_player_step_hold);

        // sounds
        this.sounds = {
            pull: new Howl({
                src: ['sounds/pull.ogg']
            }),
            pull_done: new Howl({
                src: ['sounds/pull_done.ogg']
            }),
            plant: new Howl({
                src: ['sounds/plant.ogg']
            }),
            footstep: new Howl({
                src: ['sounds/footstep.ogg']
            }),
        };

        this.pos = new pixi.Point(x, y);
        this.acc = 300;
        this.decc = 50;
        this.speed = new pixi.Point(0, 0);
        this.max_speed = 50;
        this.walk_meter = 0;

        this.c_pull = {
            pulling: false,
            pullSpeed: 2,
            t: 0,
            target: null,
        };

        this.bag = new Bag();

        this.update = function(dt) {
            that.updateMovement(dt);

            that.updateInteraction(dt);
        };

        this.updateInteraction = function(dt) {
            if (input.keypressed.ACTION && !that.bag.isOpen) {
                if (!that.holding) {
                    Flower.flowers.forEach(function(flower) {
                        if (!that.c_pull.pulling
                            && flower.planted
                            && utils.distance(that.pos, flower.pos) <= 4) {
                            that.c_pull.pulling = true;
                            that.c_pull.t = 0;
                            that.c_pull.target = flower;

                            g_player.visible = false;
                            g_player_step.visible = false;
                            g_player_pull.visible = true;
                            // put beside flower
                            var dx = that.pos.x < flower.pos.x ? 1 : -1;
                            g_player_pull.scale.x = dx;
                            that.pos.x = flower.pos.x - dx * 3;
                            that.pos.y = flower.pos.y;
                            that.graphics.position.x = that.pos.x | 0;
                            that.graphics.position.y = that.pos.y | 0;

                            that.sounds.pull.play();
                        }
                    });
                } else {
                    var flower = that.holding;

                    var pos = new pixi.Point(
                        8 * (that.pos.x / 8 | 0) + 4,
                        8 * (that.pos.y / 8 | 0) + 4);

                    if (utils.distance(pos, Basket.basket.pos) < 4) {
                        if (Basket.basket.put(flower)) {
                            // yay
                            if (that.holding.swarm) {
                                that.holding.swarm.releaseFlower();
                            }
                            that.holding = null;

                            that.setGraphic(g_player);
                            return;
                        } else {
                            // could not place in basket
                            return;
                        }
                    }

                    flower.planted = true;
                    global.stages.ground.addChild(flower.graphics);
                    flower.setPos(pos.x, pos.y);

                    that.holding = null;
                    g_player.visible = true;
                    g_player_hold.visible = false;
                    g_player_step.visible = false;
                    g_player_step_hold.visible = false;

                    that.sounds.plant.play();
                }
            }
            if (input.keyreleased.ACTION) {
                if (that.c_pull.pulling) {
                    that.c_pull.pulling = false;
                    that.c_pull.target = null;

                    g_player.visible = true;
                    g_player_pull.visible = false;

                    that.sounds.pull.stop();
                }
            }

            // bag
            if (input.keypressed.BAG && !that.c_pull.pulling) {
                if (!that.bag.isOpen) {
                    if (that.holding) {
                        // try to pocket it
                        if (that.bag.pocketItem(that.holding)) {
                            if (that.holding.swarm) {
                                that.holding.swarm.releaseFlower();
                            }
                            that.holding = null;

                            that.setGraphic(g_player);
                        }
                    } else {
                        that.setGraphic(g_player);
                        that.bag.open();
                    }
                } else {
                    that.bag.selectNext();
                }
            }
            if (input.keypressed.CLOSE && that.bag.isOpen) {
                that.bag.close();
            }
            if ((input.keypressed.CONFIRM || input.keypressed.ACTION) && that.bag.isOpen) {
                var item = that.bag.grabItem();
                if (item) {
                    that.bag.close();

                    that.holding = item;
                    that.graphics.addChild(item.graphics);
                    item.graphics.position.x = 0;
                    item.graphics.position.y = 0;

                    that.setGraphic(g_player_hold);
                }
            }

            if (that.c_pull.pulling && !that.bag.isOpen) {
                that.c_pull.t += that.c_pull.pullSpeed * dt;

                g_player_pull.position.x = that.c_pull.t * Math.cos(that.c_pull.t * 30) * 0.3;

                if (that.c_pull.t >= 1) {
                    var flower = that.c_pull.target;
                    that.c_pull.pulling = false;
                    that.c_pull.target = null;

                    that.holding = flower;
                    flower.planted = false;

                    that.graphics.addChild(flower.graphics);

                    flower.setPos(0, -4, that);

                    g_player_hold.visible = true;
                    g_player_step.visible = false;
                    g_player_pull.visible = false;

                    that.sounds.pull.stop();
                    that.sounds.pull_done.play();
                }
            }
        };

        this.updateMovement = function(dt) {
            var dx = 0, dy = 0;

            if (that.c_pull.pulling || that.bag.isOpen) {
                // disable movement if pulling or baging
                return;
            }

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

            if (that.pos.x < 4) {
                that.pos.x = 4;
            }
            if (that.pos.x > global.size * 8 - 4) {
                that.pos.x = global.size * 8 - 4;
            }
            if (that.pos.y < 4) {
                that.pos.y = 4;
            }
            if (that.pos.y > global.size * 8 - 4) {
                that.pos.y = global.size * 8 - 4;
            }

            var tx = that.pos.x | 0;
            var ty = that.pos.y | 0;

            if (that.holding) {
                that.holding.setPos(0, -6, that);
            }

            that.graphics.position.x += (tx - that.graphics.position.x) * 20 * dt;
            that.graphics.position.y += (ty - that.graphics.position.y) * 20 * dt;

            that.graphics.scale.x = dx < 0 ? -1 : 1;

            if (dx != 0 || dy != 0) {
                g_player.visible = false;
                g_player_hold.visible = false;

                if (that.holding) {
                    g_player_step_hold.visible = true;
                } else {
                    g_player_step.visible = true;
                }

                if (input.keypressed.LEFT || input.keypressed.RIGHT) {
                    if (that.holding) {
                        g_player_step_hold.gotoAndPlay(0);
                    } else {
                        g_player_step.gotoAndPlay(0);
                    }
                }

                that.walk_meter += 4 * dt;
                if (that.walk_meter >= 1) {
                    that.sounds.footstep.play();
                    that.walk_meter = 0;
                }

            } else {
                if (that.holding) {
                    g_player_hold.visible = true;
                    g_player_step_hold.visible = false;
                } else {
                    g_player.visible = true;
                    g_player_step.visible = false;
                }

                that.walk_meter = 0.8;
            }
        }

        this.setGraphic = function(g) {
            g_player.visible = false;
            g_player_hold.visible = false;
            g_player_step.visible = false;
            g_player_step_hold.visible = false;
            g_player_pull.visible = false;

            g.visible = true;
        }
    }

});