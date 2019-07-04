define(['pixi'], function(pixi) {

    Flower.flowers = [];

    return Flower;

    function Flower(x, y) {
        var that = this;

        var t_flower = pixi.Texture.from('images/flower-2.png');
        var g = new pixi.Sprite(t_flower);
        g.position.x = x;
        g.position.y = y;
        g.pivot.x = 4;
        g.pivot.y = 4;
        this.graphics = g;

        this.pos = new pixi.Point(x, y);
        this.planted = true;

        this.swarm = null;

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

    }

});