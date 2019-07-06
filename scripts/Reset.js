define(['pixi', 'Flower'], function(pixi, Flower) {

    return Reset;

    function Reset(x, y) {
        this.graphics = new pixi.Container();
        this.graphics.pivot.x = 4;
        this.graphics.pivot.y = 4;
        this.graphics.position.x = x;
        this.graphics.position.y = y;

        this.pos = new pixi.Point(x, y);
        console.log(this.pos);

        // flower
        var t_reset = pixi.Texture.from('images/reset.png');
        var g_reset = new pixi.Sprite(t_reset);
        this.graphics.addChild(g_reset);

        Flower.flowers.push(this);

        this.update = function() { };
    }

});