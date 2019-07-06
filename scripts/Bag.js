define(['pixi', 'global', 'Flower'], function(pixi, global, Flower) {

    return Bag;

    function Bag() {
        var that = this;

        var g_container = new pixi.Container();
        this.graphics = g_container;
        g_container.pivot.y = 12;
        g_container.position.x = 4;
        g_container.position.y = global.size * global.spriteSize - 4;
        global.stages.interface.addChild(g_container);

        var selector = new BagSelector();
        this.selector = selector;
        this.graphics.addChild(selector.graphics);

        var items = [];
        var item = new BagItem(0);
        this.graphics.addChild(item.graphics);
        items.push(item);
        this.items = items;

        this.isOpen = false;
        g_container.visible = false;

        this.open = function() {
            that.isOpen = true;
            that.graphics.visible = true;
            var item = that.items.find(function(item) {
                return item.item;
            });
            that.selector.select(item || that.items[0]);
        };

        this.close = function() {
            that.isOpen = false;
            that.graphics.visible = false;
        };

        this.selectNext = function() {
            if (!that.selector.selected) {
                that.selector.select(that.items[0]);
                return;
            }
            var item = that.selector.selected;
            var index = item.index + 1;

            if (index >= that.items.length) {
                that.close();
            } else {
                that.selector.select(that.items[index]);
            }
        };

        this.grabItem = function() {
            if (!that.selector.selected) {
                return null;
            }
            return that.selector.selected.grab();
        };

        this.pocketItem = function(item) {
            var bagItem = that.items.find(function(bagItem) {
                return !bagItem.item;
            });
            if (!bagItem) {
                return false;
            }
            return bagItem.put(item);
        };

        this.fill = function(list) {
            that.items.forEach(function(item) {
                if (item.item) {
                    item.item.graphics.parent.removeChild(item.item.graphics);
                }
                item.graphics.parent.removeChild(item.graphics);
            });

            var items = [];
            var rows = Math.ceil(list.length / 4);
            for (var i = 0; i < list.length; i++) {
                var item = new BagItem(i);
                that.graphics.addChild(item.graphics);

                var xpos = i % 4;
                var ypos = (i - xpos) / 4;
                item.graphics.position.x = xpos * 14;
                item.graphics.position.y = (ypos - (rows - 1)) * 14;

                item.put(list[i]);
                items.push(item);
            }
            that.items = items;
        }
    }

    function BagItem(index) {
        var that = this;

        var g = new pixi.Graphics();
        this.graphics = g;
        g.beginFill(0x402a1e);
        g.drawRect(0, 0, 12, 12);
        g.endFill();

        this.index = index;
        this.item = null;

        this.put = function(item) {
            if (!that.item) {
                if (item instanceof Flower && item.swarm) {
                    item.swarm.releaseFlower();
                }
                that.item = item;
                item.bagged = true;
                that.graphics.addChild(item.graphics);
                item.graphics.position.x = 6;
                item.graphics.position.y = 6;
                return true;
            }
            return false;
        };

        this.grab = function() {
            if (that.item) {
                var item = that.item;
                that.item = null;
                item.bagged = false;
                return item;
            }
            return null;
        };
    }

    function BagSelector() {
        var that = this;

        var g = new pixi.Graphics();
        this.graphics = g;
        g.lineStyle(2, 0xffffff);
        g.drawRect(0, 0, 12, 12);
        g.endFill();
        g.visible = false;

        this.selected = null;

        this.select = function(item) {
            if (item) {
                that.selected = item;

                that.graphics.visible = true;
                that.graphics.position.x = item.graphics.position.x;
                that.graphics.position.y = item.graphics.position.y;
            } else {
                that.selected = null;

                that.graphics.visible = false;
            }
        };
    }

});