define(['pixi', 'utils', 'global', 'Flower'], function(pixi, utils, global, Flower) {

    Basket.basket = null;

    return Basket;

    function Basket(x, y) {
        var that = this;

        Basket.basket = this; // singleton-ish

        var t_basket = pixi.Texture.from('images/basket.png');
        var g_basket = new pixi.Sprite(t_basket);
        g_basket.position.x = x;
        g_basket.position.y = y;
        g_basket.pivot.x = 4;
        g_basket.pivot.y = 4;
        this.graphics = g_basket;

        this.pos = new pixi.Point(x, y);

        this.a_grow = false;
        this.a_growTimer = 0;
        this.a_growLength = 2;

        this.basket = [];

        this.onItem = new utils.Listener();

        this.put = function(item) {
            if (item instanceof Flower) {
                if (item.fertilized) {
                    that.basket.push(item);
                    item.graphics.parent.removeChild(item.graphics);

                    that.a_grow = true;
                    that.a_growTimer = 0;

                    that.onItem.emit(item);

                    return true;
                }
            }
            return false;
        };

        this.update = function(d) {
            if (that.a_grow) {
                that.a_growTimer += d;

                var t = that.a_growTimer;
                var s = that.a_growLength;
                t = Math.min(t, s);
                that.graphics.scale.x = 1 + 0.3 * ((s - t) / s) * Math.cos(t * 10 * s);
                that.graphics.scale.y = 1 + 0.3 * ((s - t) / s) * Math.sin(t * 10 * s + Math.PI);

                if (t == s) {
                    that.a_grow = false;
                    that.a_growTimer = 0;
                }
            }
        };

    }

});