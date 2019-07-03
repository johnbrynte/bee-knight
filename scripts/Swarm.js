define(['pixi'], function(pixi) {

    return Swarm;

    function Swarm(count) {
        var that = this;

        count = count || 6;
        this.swarm = [];
        this.container = new pixi.Container();

        for (var i = 0; i < count; i++) {
            var bee = new Bee();
            this.container.addChild(bee.graphics);
            this.swarm.push(bee);
        }

        this.update = function(d) {
            that.swarm.forEach(function(bee) {
                bee.update(d);
            });
        };
    }

    function Bee() {
        var that = this;

        this.pos = new pixi.Point();
        this.pos.x = 8 * (0.5 - Math.random());
        this.pos.y = 8 * (0.5 - Math.random());
        console.log(this.pos);

        this.path = new pixi.Point();
        this.path.x = 2 + 3 * Math.random();
        this.path.y = 2 + 3 * Math.random();
        this.angle = Math.random();
        this.dir = Math.random() > 0.5 ? 1 : -1;
        this.speed = 1 + Math.random() * 3;

        var g = new pixi.Graphics();
        this.graphics = g;
        g.beginFill(0x402a1e);
        g.drawRect(0, 0, 1, 1);
        g.endFill();

        this.update = function(d) {
            that.angle += (that.speed + Math.random()) * that.dir * d;
            that.pos.x = Math.cos(that.angle) * that.path.x;
            that.pos.y = Math.sin(that.angle) * that.path.y;

            that.graphics.position.x = (that.pos.x) | 0;
            that.graphics.position.y = (that.pos.y) | 0;
        };

    }

});