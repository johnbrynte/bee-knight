define(['pixi', 'utils', 'Flower'], function(pixi, utils, Flower) {

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
        this.acc = 0.001;
        this.decc = 1;

        for (var i = 0; i < count; i++) {
            var bee = new Bee();
            this.container.addChild(bee.graphics);
            this.swarm.push(bee);
        }

        Swarm.swarms.push(this);

        this.update = function(d) {
            that.swarm.forEach(function(bee) {
                bee.update(d);
            });

            var flower = null;
            var closest = Infinity;
            Flower.flowers.forEach(function(f) {
                d = utils.distance(that.pos, f.pos);
                if (d < closest) {
                    closest = d;
                    flower = f;
                }
            });

            if (flower && closest < 2 * 8) {
                that.target.x = flower.pos.x;
                that.target.y = flower.pos.y;
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
        this.path.x = 2 + 3 * Math.random();
        this.path.y = 2 + 3 * Math.random();
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
            that.pos.y = Math.sin(that.angle) * that.path.y;

            that.graphics.scale.x = x < 0 ? 1 : -1;

            that.graphics.position.x = (that.pos.x) | 0;
            that.graphics.position.y = (that.pos.y) | 0;
        };

    }

});