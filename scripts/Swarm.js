define(['pixi', 'global', 'utils', 'Flower'], function(pixi, global, utils, Flower) {

    Swarm.swarms = [];

    return Swarm;

    function Swarm(x, y, count) {
        var that = this;

        count = count || 6;
        this.swarm = [];
        this.container = new pixi.Container();
        // this.container.pivot.x = 4;
        // this.container.pivot.y = 4;

        this.pos = new pixi.Point(x, y);
        this.target = new pixi.Point(x, y);
        this.speed = new pixi.Point(0, 0);
        this.acc = 1;
        this.decc = 1;

        this.flower = null;
        this.prevFlower = null;
        this.targetFlower = null;
        this.visited = [];

        this.stayTimer = 0;
        this.stayTimeDelay = 3;
        this.wandering = true;
        this.wanderingTimer = 0;
        this.returnToHome = true;

        this.pollenStore = new Flower.PollenStore();

        var text = new pixi.Text('-', {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0x1010ff,
            align: 'center',
        });
        text.position.y = -16;
        //this.container.addChild(text);

        for (var i = 0; i < count; i++) {
            var bee = new Bee();
            this.container.addChild(bee.graphics);
            this.swarm.push(bee);
        }

        Swarm.swarms.push(this);

        this.isFlowerInteresting = function(flower) {
            if ((flower.swarm && flower.swarm != that) || flower.empty()) {
                return false;
            }
            if (that.pollenStore[flower.type] < 1) {
                return true;
            }
            return false;
        };

        this.pickRandomTarget = function() {
            var dx = Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            var dy = dx == 0 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            var x = that.target.x + dx * 8;
            var y = that.target.y + dy * 8;

            if (x - 8 < 0 || x + 8 > global.size * 8) {
                x -= dx * 2;
            }
            if (y - 8 < 0 || y + 8 > global.size * 8) {
                y -= dy * 2;
            }

            that.target.x = x;
            that.target.y = y;
        }

        this.hasVisited = function(f) {
            return that.visited.indexOf(f.id) != -1;
        };

        this.releaseFlower = function() {
            if (that.flower) {
                that.flower.swarm = null;
                that.flower = null;
                that.targetFlower = null;
            }
            that.wandering = true;
            that.target.x = that.pos.x;
            that.target.y = that.pos.y;
        };

        this.checkWeight = function() {
            if (that.pollenStore.getWeight() >= 3) {
                that.returnToHome = true;
            }
        };

        this.update = function(d) {
            that.swarm.forEach(function(bee) {
                bee.update(d);
            });

            if (that.returnToHome) {
                that.pos.x += Math.min((global.home.x - that.pos.x) * that.acc, 30) * d;
                that.pos.y += Math.min((global.home.y - that.pos.y) * that.acc, 30) * d;

                that.container.position.x = that.pos.x;
                that.container.position.y = that.pos.y;

                if (utils.distance(that.pos, global.home) < 3) {
                    that.releaseFlower();
                    that.pollenStore.reset();

                    that.returnToHome = false;
                    that.wandering = false;
                }
                return;
            }

            var closest_flower = null;
            var closest_distance = Infinity;
            var interest_flower = null;
            var interest_distance = Infinity;
            Flower.flowers.forEach(function(f) {
                if (!(f instanceof Flower)) {
                    return;
                }

                if (that.targetFlower) {
                    return;
                }

                if (f.fertilized || f.bagged) {
                    return;
                }

                var d = utils.distance(that.pos, f.pos);

                if (d < 3 * 8) {
                    if (d < closest_distance && (!that.prevFlower || that.prevFlower != f)) {
                        closest_distance = d;
                        closest_flower = f;
                    }
                    if (that.isFlowerInteresting(f)) {
                        if (d < interest_distance) {
                            interest_distance = d;
                            interest_flower = f;
                        }
                    }
                }
            });
            var flower = closest_flower,
                closest = closest_distance;
            if (interest_flower) {
                flower = interest_flower;
                closest = interest_distance;
            }
            if (that.targetFlower) {
                flower = that.targetFlower;
                closest = utils.distance(that.pos, that.targetFlower.pos);
            }

            if (flower) {
                if (!flower.swarm) {
                    if (that.flower) {
                        that.flower.swarm = null;
                    }
                    that.stayTimer = 0;
                    that.stayTimeDelay = 3 + Math.random() * 3;

                    that.prevFlower = null;
                    that.flower = flower;
                    that.targetFlower = flower;
                    flower.swarm = that;

                    that.visited.push(flower.id);
                    that.wandering = false;
                }
                // if same flower
                if (that.flower == flower && that.flower.planted) {

                    if (that.isFlowerInteresting(that.flower)) {

                        if (closest < 3) {
                            that.targetFlower = null;

                            // collect pollen
                            that.flower.collectPollen(that, (1 / 4) * d);

                            that.checkWeight();
                        }
                    } else {
                        if (closest < 3) {
                            // collect pollen
                            that.flower.collectPollen(that, 0);

                            that.checkWeight();
                        }

                        that.stayTimer += d;

                        if (that.stayTimer > that.stayTimeDelay) {
                            // leave flower
                            that.flower.swarm = null;
                            that.prevFlower = that.flower;

                            that.flower = null;
                            that.targetFlower = null;
                            // that.wandering = true;
                            // that.wanderingTimer = 0;
                            //that.pickRandomTarget();
                        }
                    }
                }
            }

            if (that.flower) {
                that.target.x = that.flower.pos.x;
                that.target.y = that.flower.pos.y;
            }
            if (that.wandering) {
                that.wanderingTimer += d;
                if (that.wanderingTimer > 3) {
                    that.wanderingTimer = 0;
                    //that.pickRandomTarget();
                    that.returnToHome = true;
                }
            }

            that.pos.x += (that.target.x - that.pos.x) * that.acc * d;
            that.pos.y += (that.target.y - that.pos.y) * that.acc * d;

            that.container.position.x = that.pos.x;
            that.container.position.y = that.pos.y;
        };
    }

    function Bee() {
        var that = this;

        this.pos = new pixi.Point();
        this.pos.x = 8 * (0.5 - Math.random());
        this.pos.y = 8 * (0.5 - Math.random());

        this.path = new pixi.Point();
        this.path.x = 2 + 4 * Math.random();
        this.path.y = 2 + 4 * Math.random();
        this.angle = Math.random();
        this.dir = Math.random() > 0.5 ? 1 : -1;
        this.speed = 1 + Math.random() * 3;

        var g = new pixi.Graphics();
        this.graphics = g;
        g.beginFill(0x402a1e);
        g.drawRect(-1, 0, 1, 1);
        g.beginFill(0xf4df1a);
        g.drawRect(0, 0, 1, 1);
        g.endFill();

        this.update = function(d) {
            that.angle += (that.speed + Math.random()) * that.dir * d;
            var x = Math.cos(that.angle);
            that.pos.x = x * that.path.x;
            var y = Math.sin(that.angle);
            that.pos.y = y * that.path.y;

            that.graphics.scale.x = -that.dir * (y < 0 ? 1 : -1);

            that.graphics.position.x = (that.pos.x) | 0;
            that.graphics.position.y = (that.pos.y) | 0;
        };

    }

});