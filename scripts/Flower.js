define(['pixi'], function(pixi) {

    Flower.flowers = [];

    Flower.A = 'A';
    Flower.B = 'B';
    Flower.C = 'C';

    Flower.types = [Flower.A, Flower.B, Flower.C];

    Flower.PollenStore = PollenStore;

    Flower.ID = 1;

    return Flower;

    function Flower(x, y, type) {
        var that = this;

        this.id = (Flower.ID++);

        var textures;
        switch (type) {
            case Flower.B:
                textures = ["flower-B", "flower-B_empty", "flower-2_berry"];
                break;
            case Flower.A:
            default:
                textures = ["flower-2", "flower-2_empty", "flower-2_berry"];
                break;
        }

        this.graphics = new pixi.Container();
        this.graphics.pivot.x = 4;
        this.graphics.pivot.y = 4;
        this.graphics.position.x = x;
        this.graphics.position.y = y;

        // flower
        var t_flower = pixi.Texture.from('images/' + textures[0] + '.png');
        var g_flower = new pixi.Sprite(t_flower);
        this.graphics.addChild(g_flower);

        // flower empty
        var t_flower_empty = pixi.Texture.from('images/' + textures[1] + '.png');
        var g_flower_empty = new pixi.Sprite(t_flower_empty);
        g_flower_empty.visible = false;
        this.graphics.addChild(g_flower_empty);

        // flower berry
        var t_flower_berry = pixi.Texture.from('images/' + textures[2] + '.png');
        var g_flower_berry = new pixi.Sprite(t_flower_berry);
        g_flower_berry.visible = false;
        this.graphics.addChild(g_flower_berry);

        this.a_growTimer = 0;
        this.a_growLength = 2;

        this.sounds = {
            berry: new Howl({
                src: ['sounds/berry.ogg']
            }),
        };

        var text = new pixi.Text('-', {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xff1010,
            align: 'center',
        });
        //this.graphics.addChild(text);

        this.pos = new pixi.Point(x, y);
        this.planted = false;
        this.bagged = false;

        this.swarm = null;

        this.type = type || Flower.A;
        this.pollenStore = new PollenStore(this.type);
        this.fertilized = false;

        Flower.flowers.push(this);

        this.setPos = function(x, y, p) {
            that.graphics.position.x = x;
            that.graphics.position.y = y;

            if (p) {
                that.pos.x = (p.pos.x | 0) + x;
                that.pos.y = (p.pos.y | 0) + y;
            } else {
                that.pos.x = x;
                that.pos.y = y;
            }
        };

        this.collectPollen = function(agent, amount) {
            that.pollenStore.collect(agent.pollenStore, amount);

            var a = [];
            Flower.types.forEach(function(t) {
                a.push(Math.round(that.pollenStore[t] * 3));
            });
            text.text = a.join(",");

            if (!that.fertilized) {
                if (that.pollenStore.empty()) {
                    that.setGraphic(g_flower_empty);
                }

                if (that.pollenStore.isFertilized()) {
                    that.fertilized = true;
                    that.setGraphic(g_flower_berry);

                    if (that.swarm) {
                        that.swarm.releaseFlower();
                    }

                    that.sounds.berry.play();
                }
            }
        };

        this.empty = function() {
            that.pollenStore.empty();
        };

        this.setGraphic = function(g) {
            g_flower.visible = false;
            g_flower_empty.visible = false;
            g_flower_berry.visible = false;

            g.visible = true;
        };

        this.update = function(d) {
            if (that.fertilized) {
                if (that.a_growTimer < that.a_growLength) {
                    that.a_growTimer += d;

                    var t = that.a_growTimer;
                    var s = that.a_growLength;
                    t = Math.min(t, s);
                    that.graphics.scale.x = 1 + 0.3 * ((s - t) / s) * Math.cos(t * 10 * s);
                    that.graphics.scale.y = 1 + 0.3 * ((s - t) / s) * Math.sin(t * 10 * s + Math.PI);
                }
            }
        };

    }

    function PollenStore(type) {
        var that = this;

        this.collected = {};
        // init
        Flower.types.forEach(function(t) {
            that[t] = 0;
            that.collected[t] = 0;
        });

        this.type = null;
        if (type) {
            this.type = type;
            this[type] = 1;
        }

        this.collect = function(store, amount) {
            var _amount = 0;
            if (that[that.type] >= amount) {
                _amount = amount;
                that[that.type] -= amount;
            } else {
                _amount = that[that.type];
                that[that.type] = 0;
            }
            // exchange pollen if different types
            if (!store.type) {
                Flower.types.forEach(function(t) {
                    if (store[t] > 0 && that[t] < 1 && that.type != t) {
                        that[t] += (1 / 60) * (1 / 4);
                    }
                });
            }
            if (that.type != store.type) { //that[that.type] > 0 && 
                store[that.type] += (1 / 60) * (1 / 4);
            }
        }

        this.isFertilized = function() {
            var count = 0;
            Flower.types.forEach(function(t) {
                if (that.type == t || that[t] >= 1) {
                    count += 1;
                }
            });
            return count >= 2;
        };

        this.getValue = function() {
            if (!that.type) {
                return 0;
            }
            return that[that.type];
        };

        this.getWeight = function() {
            var w = 0;
            Flower.types.forEach(function(t) {
                w += that[t];
            });
            return w;
        };

        this.reset = function() {
            Flower.types.forEach(function(t) {
                that[t] = 0;
                that.collected[t] = 0;
            });

            if (that.type) {
                that[that.type] = 1;
            }
        };

        this.empty = function() {
            if (!that.type) {
                return true;
            }
            return that[that.type] == 0;
        }
    }

});